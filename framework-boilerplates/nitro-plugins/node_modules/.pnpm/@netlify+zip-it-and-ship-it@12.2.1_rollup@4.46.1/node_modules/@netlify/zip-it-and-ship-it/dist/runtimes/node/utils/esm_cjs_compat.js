/**
 * This shim makes calls to `require`, `__filename` and `__dirname` work when
 * bundling to ESM with esbuild.
 *
 * https://github.com/evanw/esbuild/pull/2067
 */
export const CJS_SHIM = `
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);
`;
