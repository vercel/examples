export declare const defaultFlags: {
    readonly buildRustSource: boolean;
    readonly parseWithEsbuild: false;
    readonly traceWithNft: false;
    readonly zisi_pure_esm: false;
    readonly zisi_pure_esm_mjs: false;
    readonly zisi_output_cjs_extension: false;
    readonly zisi_esbuild_fail_double_glob: false;
    readonly zisi_add_instrumentation_loader: true;
    readonly zisi_dynamic_import_function_handler_entry_point: false;
};
export type FeatureFlags = Partial<Record<keyof typeof defaultFlags, boolean>>;
export declare const getFlags: (input?: Record<string, boolean>, flags?: {
    readonly buildRustSource: boolean;
    readonly parseWithEsbuild: false;
    readonly traceWithNft: false;
    readonly zisi_pure_esm: false;
    readonly zisi_pure_esm_mjs: false;
    readonly zisi_output_cjs_extension: false;
    readonly zisi_esbuild_fail_double_glob: false;
    readonly zisi_add_instrumentation_loader: true;
    readonly zisi_dynamic_import_function_handler_entry_point: false;
}) => FeatureFlags;
