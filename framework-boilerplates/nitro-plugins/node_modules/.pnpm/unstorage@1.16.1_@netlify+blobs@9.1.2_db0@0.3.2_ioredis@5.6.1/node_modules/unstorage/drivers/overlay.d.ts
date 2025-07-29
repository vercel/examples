import type { Driver } from "..";
export interface OverlayStorageOptions {
    layers: Driver[];
}
declare const _default: (opts: OverlayStorageOptions) => Driver<OverlayStorageOptions, never>;
export default _default;
