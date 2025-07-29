import type { Plugin } from 'esbuild';
import type { NativeNodeModules } from '../types.js';
export declare const getNativeModulesPlugin: (externalizedModules: NativeNodeModules) => Plugin;
