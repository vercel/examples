// Handle request body
export const addBody = function (body, parameters, opts) {
    if (!body) {
        return opts;
    }
    const bodyA = typeof body === 'function' ? body() : body;
    if (isBinaryBody(parameters)) {
        return {
            ...opts,
            body: bodyA,
            headers: { 'Content-Type': 'application/octet-stream', ...opts.headers },
        };
    }
    return {
        ...opts,
        body: JSON.stringify(bodyA),
        headers: { 'Content-Type': 'application/json', ...opts.headers },
    };
};
const isBinaryBody = function (parameters) {
    return Object.values(parameters.body).some(isBodyParam);
};
const isBodyParam = function ({ schema }) {
    return schema && schema.format === 'binary';
};
