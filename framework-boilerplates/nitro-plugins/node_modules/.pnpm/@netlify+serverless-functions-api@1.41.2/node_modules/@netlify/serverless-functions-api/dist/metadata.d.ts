interface TrackRequestOptions {
    awsRequestID: string;
    branch?: string;
    functionName?: string;
    logToken?: string;
    req: Request;
}
export declare const trackRequest: ({ awsRequestID, req, branch, functionName, logToken }: TrackRequestOptions) => void;
interface TrackResponseOptions {
    awsRequestID: string;
    result: unknown;
}
export declare const trackResponse: ({ awsRequestID, result }: TrackResponseOptions) => void;
export {};
