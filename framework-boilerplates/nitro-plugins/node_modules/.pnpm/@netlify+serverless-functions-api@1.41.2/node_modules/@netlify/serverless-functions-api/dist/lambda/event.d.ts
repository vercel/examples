export interface InvocationMetadata {
    branch: string;
    function_name: string;
}
export interface LambdaEvent {
    rawUrl: string;
    path: string;
    httpMethod: string;
    headers: Record<string, string>;
    body: string | undefined;
    isBase64Encoded: boolean;
    route?: string;
    blobs?: string;
    flags?: Record<string, unknown>;
    initStartTimestamp?: number;
    invocationMetadata?: InvocationMetadata;
    logToken?: string;
    pcURL?: string;
    pcToken?: string;
}
