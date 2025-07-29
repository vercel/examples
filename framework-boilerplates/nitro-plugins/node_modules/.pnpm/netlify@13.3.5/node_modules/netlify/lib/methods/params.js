import { camelCase } from 'lodash-es';
export const getRequestParams = function (params, requestParams, name) {
    const entries = Object.values(params).map((param) => getRequestParam(param, requestParams, name));
    return Object.assign({}, ...entries);
};
const getRequestParam = function (param, requestParams, name) {
    const value = requestParams[param.name] || requestParams[camelCase(param.name)];
    if (value !== undefined) {
        return { [param.name]: value };
    }
    if (param.required) {
        throw new Error(`Missing required ${name} '${param.name}'`);
    }
};
