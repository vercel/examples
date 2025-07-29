import { type LocalStorageOptions } from "./localstorage";
export interface SessionStorageOptions extends LocalStorageOptions {
}
declare const _default: (opts: LocalStorageOptions | undefined) => import("..").Driver<LocalStorageOptions | undefined, Storage>;
export default _default;
