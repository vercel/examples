import "#nitro-internal-pollyfills";
import type { HttpRequest, HttpResponse } from "@azure/functions";
export declare function handle(context: {
    res: HttpResponse;
}, req: HttpRequest): Promise<void>;
