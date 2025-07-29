import { env } from 'process';
export const defaultFlags = {
    // Build Rust functions from source.
    buildRustSource: Boolean(env.NETLIFY_EXPERIMENTAL_BUILD_RUST_SOURCE),
    // Use esbuild to trace dependencies in the legacy bundler.
    parseWithEsbuild: false,
    // Use NFT as the default bundler.
    traceWithNft: false,
    // Output pure (i.e. untranspiled) ESM files when the function file has ESM
    // syntax and the parent `package.json` file has `{"type": "module"}`.
    zisi_pure_esm: false,
    // Output pure (i.e. untranspiled) ESM files when the function file has a
    // `.mjs` extension.
    zisi_pure_esm_mjs: false,
    // Output CJS file extension.
    zisi_output_cjs_extension: false,
    // If multiple glob stars are in includedFiles, fail the build instead of warning.
    zisi_esbuild_fail_double_glob: false,
    // Adds the `___netlify-telemetry.mjs` file to the function bundle.
    zisi_add_instrumentation_loader: true,
    // Dynamically import the function handler.
    zisi_dynamic_import_function_handler_entry_point: false,
};
// List of supported flags and their default value.
export const getFlags = (input = {}, flags = defaultFlags) => Object.entries(flags).reduce((result, [key, defaultValue]) => ({
    ...result,
    [key]: input[key] === undefined ? defaultValue : input[key],
}), {});
