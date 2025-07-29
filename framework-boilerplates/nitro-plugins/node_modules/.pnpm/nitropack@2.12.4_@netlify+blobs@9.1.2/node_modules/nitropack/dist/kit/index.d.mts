import { NitroPreset, NitroPresetMeta, Nitro } from 'nitropack/types';
import { N as NitroModule } from '../shared/nitro.DLF2_KRt.mjs';
import 'consola';
import 'h3';
import 'hookable';
import 'nitropack/presets';
import 'unimport';
import 'unstorage';
import '@rollup/plugin-commonjs';
import 'c12';
import 'chokidar';
import 'compatx';
import 'db0';
import 'httpxy';
import 'nitropack';
import 'pkg-types';
import 'rollup-plugin-visualizer';
import 'unenv';
import 'unimport/unplugin';
import 'unwasm/plugin';
import 'node:http';
import 'node:stream';
import 'node:worker_threads';
import 'listhen';
import 'unplugin-utils';
import '@vercel/nft';
import 'esbuild';
import 'rollup';
import '@scalar/api-reference';
import 'std-env';

declare function defineNitroPreset<P extends NitroPreset, M extends NitroPresetMeta>(preset: P, meta?: M): P & {
    _meta: NitroPresetMeta;
};

declare function defineNitroModule(def: NitroModule): NitroModule;

declare function writeFile(file: string, contents: Buffer | string, log?: boolean): Promise<void>;
declare function isDirectory(path: string): Promise<boolean>;

declare function prettyPath(p: string, highlight?: boolean): string;
declare function resolveNitroPath(path: string, nitroOptions: Nitro["options"], base?: string): string;

export { defineNitroModule, defineNitroPreset, isDirectory, prettyPath, resolveNitroPath, writeFile };
