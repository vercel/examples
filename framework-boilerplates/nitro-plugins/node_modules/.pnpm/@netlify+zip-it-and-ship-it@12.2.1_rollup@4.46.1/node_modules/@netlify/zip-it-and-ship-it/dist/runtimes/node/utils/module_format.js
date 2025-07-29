import { z } from 'zod';
export const tsExtensions = new Set(['.ts', '.cts', '.mts']);
export const MODULE_FORMAT = {
    COMMONJS: 'cjs',
    ESM: 'esm',
};
export const moduleFormat = z.nativeEnum(MODULE_FORMAT);
export const MODULE_FILE_EXTENSION = {
    CJS: '.cjs',
    CTS: '.cts',
    JS: '.js',
    MJS: '.mjs',
    MTS: '.mts',
};
export const getFileExtensionForFormat = (moduleFormat, featureFlags, runtimeAPIVersion) => {
    if (moduleFormat === MODULE_FORMAT.ESM && (runtimeAPIVersion === 2 || featureFlags.zisi_pure_esm_mjs)) {
        return MODULE_FILE_EXTENSION.MJS;
    }
    if (featureFlags.zisi_output_cjs_extension && moduleFormat === MODULE_FORMAT.COMMONJS) {
        return MODULE_FILE_EXTENSION.CJS;
    }
    return MODULE_FILE_EXTENSION.JS;
};
