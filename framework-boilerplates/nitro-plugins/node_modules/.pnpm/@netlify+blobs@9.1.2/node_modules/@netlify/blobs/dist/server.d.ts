type Logger = (...message: unknown[]) => void;

declare enum Operation {
    DELETE = "delete",
    GET = "get",
    GET_METADATA = "getMetadata",
    LIST = "list",
    SET = "set"
}
type OnRequestCallback = (parameters: {
    type: Operation;
    url: string;
}) => void;
interface BlobsServerOptions {
    /**
     * Whether debug-level information should be logged, such as internal errors
     * or information about incoming requests.
     */
    debug?: boolean;
    /**
     * Base directory to read and write files from.
     */
    directory: string;
    /**
     * Function to log messages. Defaults to `console.log`.
     */
    logger?: Logger;
    /**
     * Callback function to be called on every request.
     */
    onRequest?: OnRequestCallback;
    /**
     * Port to run the server on. Defaults to a random port.
     */
    port?: number;
    /**
     * Static authentication token that should be present in all requests. If not
     * supplied, no authentication check is performed.
     */
    token?: string;
}
declare class BlobsServer {
    private address;
    private debug;
    private directory;
    private logger;
    private onRequest?;
    private port?;
    private server?;
    private token?;
    private tokenHash;
    constructor({ debug, directory, logger, onRequest, port, token }: BlobsServerOptions);
    private dispatchOnRequestEvent;
    private delete;
    private get;
    private head;
    private listBlobs;
    private listStores;
    private logDebug;
    private put;
    /**
     * Parses the URL and returns the filesystem paths where entries and metadata
     * should be stored.
     */
    private getLocalPaths;
    private handleRequest;
    /**
     * Tries to parse a URL as being an API request and returns the different
     * components, such as the store name, site ID, key, and signed URL.
     */
    private parseAPIRequest;
    private validateAccess;
    /**
     * Traverses a path and collects both blobs and directories into a `result`
     * object, taking into account the `directories` and `prefix` parameters.
     */
    private static walk;
    start(): Promise<{
        address: string;
        family: string;
        port: number;
    }>;
    stop(): Promise<void | undefined>;
}

export { BlobsServer, type OnRequestCallback, Operation };
