import * as esbuild from 'esbuild';
import isBuiltinModule from 'is-builtin-module';
import precinct from 'precinct';
import { tmpName } from 'tmp-promise';
import { FunctionBundlingUserError } from '../../../../utils/error.js';
import { safeUnlink } from '../../../../utils/fs.js';
import { RUNTIME } from '../../../runtime.js';
import { NODE_BUNDLER } from '../types.js';
// Maximum number of log messages that an esbuild instance will produce. This
// limit is important to avoid out-of-memory errors due to too much data being
// sent in the Go<>Node IPC channel.
const ESBUILD_LOG_LIMIT = 10;
const getListImportsPlugin = ({ imports, path }) => ({
    name: 'list-imports',
    setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
            const isEntryPoint = args.path === path;
            const isImport = !isEntryPoint && !isBuiltinModule(args.path);
            if (isImport) {
                imports.add(args.path);
            }
            return {
                namespace: 'list-imports',
                external: isImport,
            };
        });
    },
});
const listImportsWithESBuild = async ({ functionName, path, }) => {
    // We're not interested in the output that esbuild generates, we're just
    // using it for its parsing capabilities in order to find import/require
    // statements. However, if we don't give esbuild a path in `outfile`, it
    // will pipe the output to stdout, which we also don't want. So we create
    // a temporary file to serve as the esbuild output and then get rid of it
    // when we're done.
    const targetPath = await tmpName();
    const imports = new Set();
    try {
        await esbuild.build({
            bundle: true,
            entryPoints: [path],
            logLevel: 'error',
            logLimit: ESBUILD_LOG_LIMIT,
            outfile: targetPath,
            platform: 'node',
            plugins: [getListImportsPlugin({ imports, path })],
            target: 'esnext',
        });
    }
    catch (error) {
        throw FunctionBundlingUserError.addCustomErrorInfo(error, {
            functionName,
            runtime: RUNTIME.JAVASCRIPT,
            bundler: NODE_BUNDLER.ZISI,
        });
    }
    finally {
        await safeUnlink(targetPath);
    }
    return [...imports];
};
const listImportsWithPrecinct = async ({ functionName, path }) => {
    try {
        return await precinct.paperwork(path, { includeCore: false });
    }
    catch (error) {
        // Syntax errors from babel are user errors
        if (error.code === 'BABEL_PARSER_SYNTAX_ERROR') {
            throw FunctionBundlingUserError.addCustomErrorInfo(error, {
                functionName,
                runtime: RUNTIME.JAVASCRIPT,
                bundler: NODE_BUNDLER.ZISI,
            });
        }
        throw error;
    }
};
export const listImports = async ({ featureFlags, ...args }) => (featureFlags.parseWithEsbuild ? await listImportsWithESBuild(args) : await listImportsWithPrecinct(args));
