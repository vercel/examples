import type { H3Event } from "h3";
/**
 * @deprecated This util is only provided for backward compatibility and will be removed in v3.
 */
export declare function isJsonRequest(event: H3Event): boolean;
/**
 * @deprecated This util is only provided for backward compatibility and will be removed in v3.
 */
export declare function normalizeError(error: any, isDev?: boolean): {
    stack: {
        text: string;
        internal: boolean;
    }[];
    statusCode: any;
    statusMessage: any;
    message: any;
};
