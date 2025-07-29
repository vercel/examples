import type { Readable } from "node:stream";
import type { APIGatewayProxyEventHeaders } from "aws-lambda";
export declare function normalizeLambdaIncomingHeaders(headers?: APIGatewayProxyEventHeaders): Record<string, string | string[] | undefined>;
export declare function normalizeLambdaOutgoingHeaders(headers: Record<string, number | string | string[] | undefined>, stripCookies?: boolean): {
    [k: string]: string;
};
export declare function normalizeLambdaOutgoingBody(body: BodyInit | ReadableStream | Buffer | Readable | Uint8Array | null | undefined, headers: Record<string, number | string | string[] | undefined>): Promise<{
    type: "text" | "binary";
    body: string;
}>;
