import type { NitroErrorHandler } from "nitropack/types";
export declare function defineNitroErrorHandler(handler: NitroErrorHandler): NitroErrorHandler;
export type InternalHandlerResponse = {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string | Record<string, any>;
};
