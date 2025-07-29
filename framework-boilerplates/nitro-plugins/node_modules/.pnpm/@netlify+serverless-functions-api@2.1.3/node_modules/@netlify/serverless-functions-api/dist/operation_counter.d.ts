export declare enum Operations {
    CacheAPIRead = "cache-api-read",
    CacheAPIWrite = "cache-api-write"
}
export declare const LIMITS: {
    "cache-api-read": number;
    "cache-api-write": number;
};
export declare class OperationCounter {
    counts: Map<string, number>;
    limits: Record<string, number>;
    constructor(limits?: Record<string, number>);
    register(operation: string): boolean;
}
