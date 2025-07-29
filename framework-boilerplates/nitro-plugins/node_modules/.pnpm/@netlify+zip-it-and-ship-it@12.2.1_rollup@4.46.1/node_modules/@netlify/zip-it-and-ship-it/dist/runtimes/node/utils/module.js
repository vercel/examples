import requirePackageName from 'require-package-name';
// Windows path normalization
const BACKSLASH_REGEXP = /\\/g;
// When doing require("moduleName/file/path"), only keep `moduleName`
export const getModuleName = function (dependency) {
    const dependencyA = dependency.replace(BACKSLASH_REGEXP, '/');
    const moduleName = requirePackageName(dependencyA);
    return moduleName;
};
