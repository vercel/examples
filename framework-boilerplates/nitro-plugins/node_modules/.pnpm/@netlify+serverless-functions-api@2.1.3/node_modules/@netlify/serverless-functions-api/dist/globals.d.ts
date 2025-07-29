import type { Context } from './context.js';
declare const env: {
    delete: (key: string) => void;
    get: (key: string) => string | undefined;
    has: (key: string) => boolean;
    set: (key: string, value: string) => void;
    toObject: () => Record<string, string>;
};
declare global {
    var Netlify: {
        context: Context | null;
        env: typeof env;
    };
}
/**
 * @deprecated globalThis.Netlify is populated during module initialisation, so this function is no longer needed.
 */
export declare const getNetlifyGlobal: () => {
    readonly context: Context | null;
    env: {
        delete: (key: string) => void;
        get: (key: string) => string | undefined;
        has: (key: string) => boolean;
        set: (key: string, value: string) => void;
        toObject: () => Record<string, string>;
    };
};
export {};
