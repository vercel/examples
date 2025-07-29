import type { H3Event } from "h3";
import type { NitroRuntimeConfig } from "nitropack/types";
export declare function useRuntimeConfig<T extends NitroRuntimeConfig = NitroRuntimeConfig>(event?: H3Event): T;
export declare function useAppConfig(event?: H3Event): any;
declare const _default: any;
export default _default;
