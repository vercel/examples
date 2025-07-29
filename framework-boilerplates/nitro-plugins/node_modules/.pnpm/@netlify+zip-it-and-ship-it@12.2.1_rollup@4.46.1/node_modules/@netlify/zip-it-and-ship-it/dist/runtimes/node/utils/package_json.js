import { promises as fs } from 'fs';
import { basename, join } from 'path';
import { findUp, findUpStop, pathExists } from 'find-up';
export const getClosestPackageJson = async (resolveDir, boundary) => {
    const packageJsonPath = await findUp(async (directory) => {
        // We stop traversing if we're about to leave the boundaries of any
        // node_modules directory.
        if (basename(directory) === 'node_modules') {
            return findUpStop;
        }
        const path = join(directory, 'package.json');
        const hasPackageJson = await pathExists(path);
        return hasPackageJson ? path : undefined;
    }, { cwd: resolveDir, stopAt: boundary });
    if (packageJsonPath === undefined) {
        return null;
    }
    const packageJson = await readPackageJson(packageJsonPath);
    return {
        contents: packageJson,
        path: packageJsonPath,
    };
};
// Retrieve the `package.json` of a specific project or module
export const getPackageJson = async function (srcDir) {
    const result = await getClosestPackageJson(srcDir);
    return result?.contents ?? {};
};
export const getPackageJsonIfAvailable = async (srcDir) => {
    try {
        const packageJson = await getPackageJson(srcDir);
        return packageJson;
    }
    catch {
        return {};
    }
};
export const readPackageJson = async (path) => {
    try {
        // The path depends on the user's build, i.e. must be dynamic
        const packageJson = JSON.parse(await fs.readFile(path, 'utf8'));
        return sanitizePackageJson(packageJson);
    }
    catch (error) {
        throw new Error(`${path} is invalid JSON: ${error.message}`);
    }
};
const sanitizeFiles = (files) => {
    if (!Array.isArray(files)) {
        return undefined;
    }
    return files.filter((file) => typeof file === 'string');
};
export const sanitizePackageJson = (packageJson) => ({
    ...packageJson,
    files: sanitizeFiles(packageJson.files),
});
