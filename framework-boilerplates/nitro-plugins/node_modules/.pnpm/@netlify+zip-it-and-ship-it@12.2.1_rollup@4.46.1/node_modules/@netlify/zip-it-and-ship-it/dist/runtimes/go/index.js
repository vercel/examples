import { basename, dirname, extname, join } from 'path';
import { copyFile } from 'copy-file';
import { cachedLstat, cachedReaddir } from '../../utils/fs.js';
import getInternalValue from '../../utils/get_internal_value.js';
import { nonNullable } from '../../utils/non_nullable.js';
import { zipBinary } from '../../zip_binary.js';
import { detectBinaryRuntime } from '../detect_runtime.js';
import { RUNTIME } from '../runtime.js';
import { build } from './builder.js';
const detectGoFunction = async ({ cache, path }) => {
    const stat = await cachedLstat(cache.lstatCache, path);
    if (!stat.isDirectory()) {
        return;
    }
    const directoryName = basename(path);
    const files = await cachedReaddir(cache.readdirCache, path);
    const mainFileName = [`${directoryName}.go`, 'main.go'].find((name) => files.includes(name));
    if (mainFileName === undefined) {
        return;
    }
    return mainFileName;
};
const findFunctionsInPaths = async function ({ cache, featureFlags, paths }) {
    const functions = await Promise.all(paths.map((path) => findFunctionInPath({ cache, featureFlags, path })));
    return functions.filter(nonNullable);
};
const findFunctionInPath = async function ({ cache, path }) {
    const runtime = await detectBinaryRuntime({ path });
    if (runtime === RUNTIME.GO) {
        return processBinary({ cache, path });
    }
    const goSourceFile = await detectGoFunction({ cache, path });
    if (goSourceFile) {
        return processSource({ cache, mainFile: goSourceFile, path });
    }
};
const processBinary = async ({ cache, path }) => {
    const stat = await cachedLstat(cache.lstatCache, path);
    const extension = extname(path);
    const filename = basename(path);
    const name = basename(path, extname(path));
    return {
        extension,
        filename,
        mainFile: path,
        name,
        srcDir: dirname(path),
        srcPath: path,
        stat,
    };
};
const processSource = async ({ cache, mainFile, path, }) => {
    // TODO: This `stat` value is not going to be used, but we need it to satisfy
    // the `FunctionSource` interface. We should revisit whether `stat` should be
    // part of that interface in the first place, or whether we could compute it
    // downstream when needed (maybe using the FS cache as an optimisation).
    const stat = (await cachedLstat(cache.lstatCache, path));
    const filename = basename(path);
    const extension = extname(mainFile);
    const name = basename(path, extname(path));
    return {
        extension,
        filename,
        mainFile: join(path, mainFile),
        name,
        srcDir: path,
        srcPath: path,
        stat,
    };
};
const zipFunction = async function ({ config, destFolder, filename, mainFile, srcDir, srcPath, stat, isInternal, }) {
    const destPath = join(destFolder, filename);
    const isSource = extname(mainFile) === '.go';
    let binary = {
        path: srcPath,
        stat,
    };
    // If we're building a Go function from source, we call the build method and
    // update `binary` to point to the newly-created binary.
    if (isSource) {
        const { stat: binaryStat } = await build({ destPath, mainFile, srcDir });
        binary = {
            path: destPath,
            stat: binaryStat,
        };
    }
    const result = {
        config,
        displayName: config?.name,
        generator: config?.generator || getInternalValue(isInternal),
    };
    // If `zipGo` is enabled, we create a zip archive with the Go binary and the
    // toolchain file.
    if (config.zipGo) {
        const zipPath = `${destPath}.zip`;
        const zipOptions = {
            destPath: zipPath,
            filename: 'bootstrap',
            runtime,
        };
        await zipBinary({ ...zipOptions, srcPath: binary.path, stat: binary.stat });
        return {
            ...result,
            path: zipPath,
            entryFilename: zipOptions.filename,
        };
    }
    // We don't need to zip the binary, so we can just copy it to the right path.
    // We do this only if we're not building from source, as otherwise the build
    // step already handled that.
    if (!isSource) {
        await copyFile(binary.path, destPath);
    }
    return {
        ...result,
        path: destPath,
        entryFilename: '',
    };
};
const runtime = { findFunctionsInPaths, findFunctionInPath, name: RUNTIME.GO, zipFunction };
export default runtime;
