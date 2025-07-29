import "#nitro-internal-pollyfills";
import type { HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
export declare function lambda(event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse>;
