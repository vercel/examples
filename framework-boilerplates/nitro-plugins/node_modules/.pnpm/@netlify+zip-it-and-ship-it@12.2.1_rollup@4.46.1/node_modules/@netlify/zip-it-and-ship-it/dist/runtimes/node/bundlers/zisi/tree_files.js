import { glob } from '../../../../utils/matching.js';
// When using a directory, we include all its descendants except `node_modules`
export const getTreeFiles = async function (srcPath, stat) {
    if (!stat.isDirectory()) {
        return [srcPath];
    }
    return await glob(`${srcPath}/**`, {
        ignore: [`${srcPath}/**/node_modules/**`],
        absolute: true,
    });
};
