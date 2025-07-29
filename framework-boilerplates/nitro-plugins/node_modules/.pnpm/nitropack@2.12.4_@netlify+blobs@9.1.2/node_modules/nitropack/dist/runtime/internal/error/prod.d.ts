import { type H3Error, type H3Event } from "h3";
import { type InternalHandlerResponse } from "./utils";
declare const _default: NitroErrorHandler;
export default _default;
export declare function defaultHandler(error: H3Error, event: H3Event, opts?: {
    silent?: boolean;
    json?: boolean;
}): InternalHandlerResponse;
