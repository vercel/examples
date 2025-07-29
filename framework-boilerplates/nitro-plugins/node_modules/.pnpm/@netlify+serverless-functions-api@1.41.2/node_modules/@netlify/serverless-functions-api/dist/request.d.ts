import type { Flags } from './flags.js';
export declare const requestFlags: unique symbol;
export declare const requestRoute: unique symbol;
declare const BaseRequest: typeof Request;
export declare class NetlifyRequest extends BaseRequest {
    [requestFlags]?: Flags;
    [requestRoute]?: string;
}
export declare const buildRequestBody: (body: string | undefined, isBase64Encoded: boolean) => BodyInit | undefined;
export {};
