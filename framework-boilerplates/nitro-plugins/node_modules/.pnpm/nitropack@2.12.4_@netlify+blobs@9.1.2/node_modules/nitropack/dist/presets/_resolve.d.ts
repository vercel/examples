import { type CompatibilityDateSpec } from "compatx";
import type { NitroPreset, NitroPresetMeta } from "nitropack/types";
export declare function resolvePreset(name: string, opts?: {
    static?: boolean;
    compatibilityDate?: false | CompatibilityDateSpec;
    dev?: boolean;
}): Promise<(NitroPreset & {
    _meta?: NitroPresetMeta;
}) | undefined>;
