import type { Cookie } from "@azure/functions";
export declare function getAzureParsedCookiesFromHeaders(headers: Record<string, number | string | string[] | undefined>): Cookie[];
