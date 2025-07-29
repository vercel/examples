import queryString from 'qs';
import { getRequestParams } from './params.js';
// Replace path parameters and query parameters in the URI, using the OpenAPI
// definition
export const getUrl = function ({ path, parameters }, basePath, requestParams) {
    const url = `${basePath}${path}`;
    const urlA = addPathParams(url, parameters, requestParams);
    const urlB = addQueryParams(urlA, parameters, requestParams);
    return urlB;
};
const addPathParams = function (url, parameters, requestParams) {
    const pathParams = getRequestParams(parameters.path, requestParams, 'path variable');
    return Object.entries(pathParams).reduce(addPathParam, url);
};
const addPathParam = function (url, [name, value]) {
    return url.replace(`{${name}}`, value);
};
const addQueryParams = function (url, parameters, requestParams) {
    const queryParams = getRequestParams(parameters.query, requestParams, 'query variable');
    if (Object.keys(queryParams).length === 0) {
        return url;
    }
    return `${url}?${queryString.stringify(queryParams, { arrayFormat: 'brackets' })}`;
};
