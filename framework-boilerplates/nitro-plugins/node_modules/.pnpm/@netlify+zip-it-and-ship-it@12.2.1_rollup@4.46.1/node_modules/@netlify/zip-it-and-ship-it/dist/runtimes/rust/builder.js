import { mkdir } from 'fs/promises';
import { basename, join } from 'path';
import tmp from 'tmp-promise';
import toml from 'toml';
import { FunctionBundlingUserError } from '../../utils/error.js';
import { cachedLstat, cachedReadFile } from '../../utils/fs.js';
import { shellUtils } from '../../utils/shell.js';
import { RUNTIME } from '../runtime.js';
import { BUILD_TARGET, MANIFEST_NAME } from './constants.js';
export const build = async ({ cache, config, name, srcDir, }) => {
    const functionName = basename(srcDir);
    try {
        await installToolchainOnce();
    }
    catch (error) {
        throw FunctionBundlingUserError.addCustomErrorInfo(error, { functionName, runtime: RUNTIME.RUST });
    }
    const targetDirectory = await getTargetDirectory({ config, name });
    await cargoBuild({ functionName, srcDir, targetDirectory });
    // By default, the binary will have the same name as the crate and there's no
    // way to override it (https://github.com/rust-lang/cargo/issues/1706). We
    // must extract the crate name from the manifest and use it to form the path
    // to the binary.
    const manifest = await cachedReadFile(cache.fileCache, join(srcDir, MANIFEST_NAME));
    const { package: { name: packageName }, } = toml.parse(manifest);
    const binaryPath = join(targetDirectory, BUILD_TARGET, 'release', packageName);
    const stat = await cachedLstat(cache.lstatCache, binaryPath);
    return {
        path: binaryPath,
        stat,
    };
};
const cargoBuild = async ({ functionName, srcDir, targetDirectory, }) => {
    try {
        await shellUtils.runCommand('cargo', ['build', '--target', BUILD_TARGET, '--release'], {
            cwd: srcDir,
            env: {
                CARGO_TARGET_DIR: targetDirectory,
            },
        });
    }
    catch (error) {
        const hasToolchain = await checkRustToolchain();
        if (hasToolchain) {
            console.error(`Could not compile Rust function ${functionName}:\n`);
        }
        else {
            error.message =
                'There is no Rust toolchain installed. Visit https://ntl.fyi/missing-rust-toolchain for more information.';
        }
        throw FunctionBundlingUserError.addCustomErrorInfo(error, { functionName, runtime: RUNTIME.RUST });
    }
};
const checkRustToolchain = async () => {
    try {
        await shellUtils.runCommand('cargo', ['-V']);
        return true;
    }
    catch {
        return false;
    }
};
// Returns the path of the Cargo target directory.
const getTargetDirectory = async ({ config, name }) => {
    const { rustTargetDirectory } = config;
    // If the config includes a `rustTargetDirectory` path, we'll use that.
    if (rustTargetDirectory) {
        // We replace the [name] placeholder with the name of the function.
        const path = rustTargetDirectory.replace(/\[name]/g, name);
        await mkdir(path, { recursive: true });
        return path;
    }
    // If the directory hasn't been configured, we'll use a temporary directory.
    const { path } = await tmp.dir();
    return path;
};
let toolchainInstallation;
// Sets the default toolchain and installs the build target defined in
// `BUILD_TARGET`. The Promise is saved to `toolchainInstallation`, so
// that we run the command just once for multiple Rust functions.
const installToolchain = async () => {
    await shellUtils.runCommand('rustup', ['default', 'stable']);
    await shellUtils.runCommand('rustup', ['target', 'add', BUILD_TARGET]);
};
const installToolchainOnce = () => {
    if (toolchainInstallation === undefined) {
        toolchainInstallation = installToolchain();
    }
    return toolchainInstallation;
};
