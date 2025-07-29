export interface LambdaContext {
    awsRequestId: string;
    callbackWaitsForEmptyEventLoop: boolean;
    clientContext: ClientContext;
    getRemainingTimeInMillis: () => number;
}
interface ClientContext {
    custom?: {
        blobs?: string;
        netlify?: string;
        purge_api_token?: string;
    };
    identity?: {
        url: string;
        token: string;
    };
}
export {};
