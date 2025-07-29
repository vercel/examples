import { basename } from 'path';
import { isJunk } from 'junk';
import { glob } from '../../../../utils/matching.js';
/**
 * Takes a function path and, if it's a directory, returns a list of all the
 * nested files, recursively, except `node_modules` and junk files.
 */
export const getSideFiles = async function (functionPath, stat) {
    if (!stat.isDirectory()) {
        return [];
    }
    const paths = await glob(`${functionPath}/**`, {
        absolute: true,
        cwd: functionPath,
        ignore: [`**/node_modules/**`],
    });
    return paths.filter((path) => !isJunk(basename(path)));
};
