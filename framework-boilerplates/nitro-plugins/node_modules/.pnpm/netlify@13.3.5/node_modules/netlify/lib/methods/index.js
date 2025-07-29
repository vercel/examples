import fetch from 'node-fetch';
import { getOperations } from '../operations.js';
import { addBody } from './body.js';
import { getRequestParams } from './params.js';
import { parseResponse, getFetchError } from './response.js';
import { shouldRetry, waitForRetry, MAX_RETRY } from './retry.js';
import { getUrl } from './url.js';
// For each OpenAPI operation, add a corresponding method.
// The `operationId` is the method name.
export const getMethods = function ({ basePath, defaultHeaders, agent, globalParams }) {
    const operations = getOperations();
    const methods = operations.map((method) => getMethod({ method, basePath, defaultHeaders, agent, globalParams }));
    return Object.assign({}, ...methods);
};
const getMethod = function ({ method, basePath, defaultHeaders, agent, globalParams }) {
    return {
        [method.operationId](params, opts) {
            return callMethod({ method, basePath, defaultHeaders, agent, globalParams, params, opts });
        },
    };
};
const callMethod = async function ({ method, basePath, defaultHeaders, agent, globalParams, params, opts }) {
    const requestParams = { ...globalParams, ...params };
    const url = getUrl(method, basePath, requestParams);
    const response = await makeRequestOrRetry({ url, method, defaultHeaders, agent, requestParams, opts });
    const parsedResponse = await parseResponse(response);
    return parsedResponse;
};
const getOpts = function ({ method: { verb, parameters }, defaultHeaders, agent, requestParams, opts }) {
    const { body } = requestParams;
    const optsA = addHttpMethod(verb, opts);
    const optsB = addHeaderParams(parameters, requestParams, optsA);
    const optsC = addDefaultHeaders(defaultHeaders, optsB);
    const optsD = addBody(body, parameters, optsC);
    const optsE = addAgent(agent, optsD);
    return optsE;
};
// Add header parameters
const addHeaderParams = function (parameters, requestParams, opts) {
    if (parameters.header === undefined) {
        return opts;
    }
    return { ...opts, headers: getRequestParams(parameters.header, requestParams, 'header parameter') };
};
// Add the HTTP method based on the OpenAPI definition
const addHttpMethod = function (verb, opts) {
    return { ...opts, method: verb.toUpperCase() };
};
// Assign default HTTP headers
const addDefaultHeaders = function (defaultHeaders, opts) {
    return { ...opts, headers: { ...defaultHeaders, ...opts.headers } };
};
// Assign fetch agent (like for example HttpsProxyAgent) if there is one
const addAgent = function (agent, opts) {
    if (agent) {
        return { ...opts, agent };
    }
    return opts;
};
const makeRequestOrRetry = async function ({ url, method, defaultHeaders, agent, requestParams, opts }) {
    // Using a loop is simpler here
    for (let index = 0; index <= MAX_RETRY; index++) {
        const optsA = getOpts({ method, defaultHeaders, agent, requestParams, opts });
        const { response, error } = await makeRequest(url, optsA);
        if (shouldRetry({ response, error, method }) && index !== MAX_RETRY) {
            await waitForRetry(response);
            continue;
        }
        if (error !== undefined) {
            throw error;
        }
        return response;
    }
};
const makeRequest = async function (url, opts) {
    try {
        const response = await fetch(url, opts);
        return { response };
    }
    catch (error) {
        const errorA = getFetchError(error, url, opts);
        return { error: errorA };
    }
};
