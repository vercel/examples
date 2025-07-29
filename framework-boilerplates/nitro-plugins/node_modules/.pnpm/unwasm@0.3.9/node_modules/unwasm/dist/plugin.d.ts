import { Plugin } from 'rollup';

interface UnwasmPluginOptions {
    /**
     * Directly import the `.wasm` files instead of bundling as base64 string.
     *
     * @default false
     */
    esmImport?: boolean;
    /**
     * Avoid using top level await and always use a proxy.
     *
     * Useful for compatibility with environments that don't support top level await.
     *
     * @default false
     */
    lazy?: boolean;
}

declare const rollup: (opts: UnwasmPluginOptions) => Plugin;
declare const _default: {
    rollup: (opts: UnwasmPluginOptions) => Plugin<any>;
};

export { type UnwasmPluginOptions, _default as default, rollup };
