export declare class PonyfillSuppressedError extends Error implements SuppressedError {
    error: any;
    suppressed: any;
    constructor(error: any, suppressed: any, message?: string);
}
