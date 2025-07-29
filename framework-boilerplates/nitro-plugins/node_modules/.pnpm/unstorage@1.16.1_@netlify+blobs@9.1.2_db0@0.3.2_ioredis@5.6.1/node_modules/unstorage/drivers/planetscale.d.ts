import type { Connection } from "@planetscale/database";
export interface PlanetscaleDriverOptions {
    url?: string;
    table?: string;
    boostCache?: boolean;
}
declare const _default: (opts: PlanetscaleDriverOptions | undefined) => import("..").Driver<PlanetscaleDriverOptions | undefined, Connection>;
export default _default;
