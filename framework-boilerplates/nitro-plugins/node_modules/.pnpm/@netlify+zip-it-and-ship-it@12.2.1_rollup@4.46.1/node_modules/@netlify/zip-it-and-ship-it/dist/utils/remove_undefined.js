import { includeKeys } from 'filter-obj';
const isUndefined = (_key, value) => value !== undefined;
export const removeUndefined = function (obj) {
    return includeKeys(obj, isUndefined);
};
