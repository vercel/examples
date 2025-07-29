/**
 * utility functions
 */
export declare function get_node_major_version(): number;
export declare function generateRandomHex(length: any): string;
export declare function getWinstonConsole(): any;
export declare function getAbsolutePath(path: any): any;
export declare function processJSON(json: any): any;
export declare function parseCookies(request: any): {};
export declare class TimeoutError extends Error {
    constructor(m: string);
}
export declare function loadAWSCredentials(path: string, profileName?: string): void;
export declare function waitForNodeJS(cb: any, i?: number): void;
