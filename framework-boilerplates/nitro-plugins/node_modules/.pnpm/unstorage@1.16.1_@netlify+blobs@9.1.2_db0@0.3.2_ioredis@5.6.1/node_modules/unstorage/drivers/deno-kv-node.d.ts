import { openKv, type Kv } from "@deno/kv";
export interface DenoKvNodeOptions {
    base?: string;
    path?: string;
    openKvOptions?: Parameters<typeof openKv>[1];
}
declare const _default: (opts: DenoKvNodeOptions) => import("..").Driver<DenoKvNodeOptions, Kv | Promise<Kv>>;
export default _default;
