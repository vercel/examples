import "#nitro-internal-pollyfills";
import type { fetch } from "@cloudflare/workers-types";
interface Env {
    ASSETS?: {
        fetch: typeof fetch;
    };
}
declare const _default: import("@cloudflare/workers-types").ExportedHandler<Env, unknown, unknown>;
export default _default;
