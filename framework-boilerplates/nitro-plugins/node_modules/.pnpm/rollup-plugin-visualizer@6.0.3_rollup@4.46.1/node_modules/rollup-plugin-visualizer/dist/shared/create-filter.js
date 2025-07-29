"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilter = void 0;
const picomatch_1 = __importDefault(require("picomatch"));
function isArray(arg) {
    return Array.isArray(arg);
}
function ensureArray(thing) {
    if (isArray(thing))
        return thing;
    if (thing == null)
        return [];
    return [thing];
}
const globToTest = (glob) => {
    const pattern = glob;
    const fn = (0, picomatch_1.default)(pattern, { dot: true });
    return {
        test: (what) => {
            const result = fn(what);
            return result;
        },
    };
};
const testFalse = {
    test: () => false,
};
const testTrue = {
    test: () => true,
};
const getMatcher = (filter) => {
    const bundleTest = "bundle" in filter && filter.bundle != null ? globToTest(filter.bundle) : testTrue;
    const fileTest = "file" in filter && filter.file != null ? globToTest(filter.file) : testTrue;
    return { bundleTest, fileTest };
};
const createFilter = (include, exclude) => {
    const includeMatchers = ensureArray(include).map(getMatcher);
    const excludeMatchers = ensureArray(exclude).map(getMatcher);
    return (bundleId, id) => {
        for (let i = 0; i < excludeMatchers.length; ++i) {
            const { bundleTest, fileTest } = excludeMatchers[i];
            if (bundleTest.test(bundleId) && fileTest.test(id))
                return false;
        }
        for (let i = 0; i < includeMatchers.length; ++i) {
            const { bundleTest, fileTest } = includeMatchers[i];
            if (bundleTest.test(bundleId) && fileTest.test(id))
                return true;
        }
        return !includeMatchers.length;
    };
};
exports.createFilter = createFilter;
