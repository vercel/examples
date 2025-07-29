/**
 * This shim makes calls to `require`, `__filename` and `__dirname` work when
 * bundling to ESM with esbuild.
 *
 * https://github.com/evanw/esbuild/pull/2067
 */
export declare const CJS_SHIM = "\nimport {createRequire as ___nfyCreateRequire} from \"module\";\nimport {fileURLToPath as ___nfyFileURLToPath} from \"url\";\nimport {dirname as ___nfyPathDirname} from \"path\";\nlet __filename=___nfyFileURLToPath(import.meta.url);\nlet __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));\nlet require=___nfyCreateRequire(import.meta.url);\n";
