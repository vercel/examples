import type { Kv } from "@deno/kv";
export interface DenoKvOptions {
    base?: string;
    path?: string;
    openKv?: () => Promise<Deno.Kv | Kv>;
}
declare const _default: (opts: DenoKvOptions) => import("..").Driver<DenoKvOptions, Promise<Deno.Kv | Kv>>;
export default _default;
