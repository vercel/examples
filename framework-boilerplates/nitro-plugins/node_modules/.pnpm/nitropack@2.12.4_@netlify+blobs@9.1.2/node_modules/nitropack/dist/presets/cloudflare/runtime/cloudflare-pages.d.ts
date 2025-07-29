import "#nitro-internal-pollyfills";
import type { Request as CFRequest, EventContext, ExecutionContext } from "@cloudflare/workers-types";
/**
 * Reference: https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#parameters
 */
interface CFPagesEnv {
    ASSETS: {
        fetch: (request: CFRequest) => Promise<Response>;
    };
    CF_PAGES: "1";
    CF_PAGES_BRANCH: string;
    CF_PAGES_COMMIT_SHA: string;
    CF_PAGES_URL: string;
    [key: string]: any;
}
declare const _default: {
    fetch(request: CFRequest, env: CFPagesEnv, context: EventContext<CFPagesEnv, string, any>): Promise<any>;
    scheduled(event: any, env: CFPagesEnv, context: ExecutionContext): void;
};
export default _default;
