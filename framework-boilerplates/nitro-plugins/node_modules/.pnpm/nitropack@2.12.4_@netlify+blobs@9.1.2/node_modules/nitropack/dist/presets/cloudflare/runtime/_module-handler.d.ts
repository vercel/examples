import "#nitro-internal-pollyfills";
import type * as CF from "@cloudflare/workers-types";
import type { ExportedHandler } from "@cloudflare/workers-types";
type MaybePromise<T> = T | Promise<T>;
export declare function createHandler<Env>(hooks: {
    fetch: (...params: [
        ...Parameters<NonNullable<ExportedHandler<Env>["fetch"]>>,
        url: URL,
        cfContextExtras: any
    ]) => MaybePromise<Response | CF.Response | undefined>;
}): ExportedHandler<Env>;
export declare function fetchHandler(request: Request | CF.Request, env: unknown, context: CF.ExecutionContext | DurableObjectState, url: URL | undefined, nitroApp: any, ctxExt: any): Promise<Response>;
export {};
