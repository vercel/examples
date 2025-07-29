import omit from './omit.js';
import { openApiSpec } from './open_api.js';
// Retrieve all OpenAPI operations
export const getOperations = function () {
    return Object.entries(openApiSpec.paths).flatMap(([path, pathItem]) => {
        const operations = omit(pathItem, ['parameters']);
        return Object.entries(operations).map(([method, operation]) => {
            const parameters = getParameters(pathItem.parameters, operation.parameters);
            return { ...operation, verb: method, path, parameters };
        });
    });
};
const getParameters = function (pathParameters = [], operationParameters = []) {
    const parameters = [...pathParameters, ...operationParameters];
    return parameters.reduce(addParameter, { path: {}, query: {}, body: {} });
};
const addParameter = function (parameters, param) {
    return { ...parameters, [param.in]: { ...parameters[param.in], [param.name]: param } };
};
