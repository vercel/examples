import "#nitro-internal-pollyfills";
import type { Handler } from "aws-lambda";
type StormkitEvent = {
    url: string;
    path: string;
    method: string;
    body?: string;
    query?: Record<string, Array<string>>;
    headers?: Record<string, string>;
    rawHeaders?: Array<string>;
};
type StormkitResponse = {
    headers?: Record<string, string>;
    body?: string;
    buffer?: string;
    statusCode: number;
    errorMessage?: string;
    errorStack?: string;
};
export declare const handler: Handler<StormkitEvent, StormkitResponse>;
export {};
