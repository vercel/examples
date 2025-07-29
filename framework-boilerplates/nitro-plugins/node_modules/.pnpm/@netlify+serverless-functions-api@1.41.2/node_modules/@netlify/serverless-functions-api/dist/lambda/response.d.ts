export interface LambdaResponse {
    statusCode: number;
    headers?: {
        [header: string]: boolean | number | string;
    };
    multiValueHeaders?: {
        [header: string]: ReadonlyArray<boolean | number | string>;
    };
    body: NodeJS.ReadableStream;
    isBase64Encoded?: boolean;
}
