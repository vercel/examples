import { handleMaybePromise } from '@whatwg-node/promise-helpers';
export function getCORSHeadersByRequestAndOptions(request, corsOptions) {
    const currentOrigin = request.headers.get('origin');
    if (corsOptions === false || currentOrigin == null) {
        return null;
    }
    const headers = {};
    // If defined origins have '*' or undefined by any means, we should allow all origins
    if (corsOptions.origin == null ||
        corsOptions.origin.length === 0 ||
        corsOptions.origin.includes('*')) {
        headers['Access-Control-Allow-Origin'] = currentOrigin;
        // Vary by origin because there are multiple origins
        headers['Vary'] = 'Origin';
    }
    else if (typeof corsOptions.origin === 'string') {
        // If there is one specific origin is specified, use it directly
        headers['Access-Control-Allow-Origin'] = corsOptions.origin;
    }
    else if (Array.isArray(corsOptions.origin)) {
        // If there is only one origin defined in the array, consider it as a single one
        if (corsOptions.origin.length === 1) {
            headers['Access-Control-Allow-Origin'] = corsOptions.origin[0];
        }
        else if (corsOptions.origin.includes(currentOrigin)) {
            // If origin is available in the headers, use it
            headers['Access-Control-Allow-Origin'] = currentOrigin;
            // Vary by origin because there are multiple origins
            headers['Vary'] = 'Origin';
        }
        else {
            // There is no origin found in the headers, so we should return null
            headers['Access-Control-Allow-Origin'] = 'null';
        }
    }
    if (corsOptions.methods?.length) {
        headers['Access-Control-Allow-Methods'] = corsOptions.methods.join(', ');
    }
    else {
        const requestMethod = request.headers.get('access-control-request-method');
        if (requestMethod) {
            headers['Access-Control-Allow-Methods'] = requestMethod;
        }
    }
    if (corsOptions.allowedHeaders?.length) {
        headers['Access-Control-Allow-Headers'] = corsOptions.allowedHeaders.join(', ');
    }
    else {
        const requestHeaders = request.headers.get('access-control-request-headers');
        if (requestHeaders) {
            headers['Access-Control-Allow-Headers'] = requestHeaders;
            if (headers['Vary']) {
                headers['Vary'] += ', Access-Control-Request-Headers';
            }
            else {
                headers['Vary'] = 'Access-Control-Request-Headers';
            }
        }
    }
    if (corsOptions.credentials != null) {
        if (corsOptions.credentials === true) {
            headers['Access-Control-Allow-Credentials'] = 'true';
        }
    }
    else if (headers['Access-Control-Allow-Origin'] !== '*') {
        headers['Access-Control-Allow-Credentials'] = 'true';
    }
    if (corsOptions.exposedHeaders) {
        headers['Access-Control-Expose-Headers'] = corsOptions.exposedHeaders.join(', ');
    }
    if (corsOptions.maxAge) {
        headers['Access-Control-Max-Age'] = corsOptions.maxAge.toString();
    }
    return headers;
}
function getCORSResponseHeaders(request, corsOptionsFactory, serverContext) {
    return handleMaybePromise(() => corsOptionsFactory(request, serverContext), corsOptions => getCORSHeadersByRequestAndOptions(request, corsOptions));
}
export function useCORS(options) {
    let corsOptionsFactory = () => ({});
    if (options != null) {
        if (typeof options === 'function') {
            corsOptionsFactory = options;
        }
        else if (typeof options === 'object') {
            const corsOptions = {
                ...options,
            };
            corsOptionsFactory = () => corsOptions;
        }
        else if (options === false) {
            corsOptionsFactory = () => false;
        }
    }
    return {
        onRequest({ request, fetchAPI, endResponse }) {
            if (request.method.toUpperCase() === 'OPTIONS') {
                const response = new fetchAPI.Response(null, {
                    status: 204,
                    // Safari (and potentially other browsers) need content-length 0,
                    // for 204 or they just hang waiting for a body
                    // see: https://github.com/expressjs/cors/blob/master/lib/index.js#L176
                    headers: {
                        'Content-Length': '0',
                    },
                });
                endResponse(response);
            }
        },
        onResponse({ request, serverContext, response }) {
            return handleMaybePromise(() => getCORSResponseHeaders(request, corsOptionsFactory, serverContext), headers => {
                if (headers != null) {
                    for (const headerName in headers) {
                        response.headers.set(headerName, headers[headerName]);
                    }
                }
            });
        },
    };
}
