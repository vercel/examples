/**
 * Retrieve the context path parameters from the URL.
 * @param path Path defined in the function. Can contain patterns like `/travel-guide/:city/:country`
 * @param url URL to match
 * @returns Resulting URLPattern's pathname groups
 */
export declare const getPathParameters: (path: string | undefined, url: string) => Record<string, string>;
