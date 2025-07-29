import { promises as fs } from 'fs';
import { init, parse } from 'es-module-lexer';
export const detectEsModule = async ({ mainFile }) => {
    if (!mainFile) {
        return false;
    }
    try {
        const [mainFileContents] = await Promise.all([fs.readFile(mainFile, 'utf8'), init]);
        const [imports, exports] = parse(mainFileContents);
        return imports.length !== 0 || exports.length !== 0;
    }
    catch {
        // If there are any problems with init or parsing, assume it's not an ES module
        return false;
    }
};
