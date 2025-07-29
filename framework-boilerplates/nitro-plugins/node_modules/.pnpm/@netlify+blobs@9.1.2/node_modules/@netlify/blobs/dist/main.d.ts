declare global {
    var netlifyBlobsContext: unknown;
}
/**
 * The context object that we expect in the environment.
 */
interface EnvironmentContext {
    apiURL?: string;
    deployID?: string;
    edgeURL?: string;
    primaryRegion?: string;
    siteID?: string;
    token?: string;
    uncachedEdgeURL?: string;
}
declare const setEnvironmentContext: (context: EnvironmentContext) => void;

type BlobInput = string | ArrayBuffer | Blob;
type Fetcher = typeof globalThis.fetch;
declare enum HTTPMethod {
    DELETE = "delete",
    GET = "get",
    HEAD = "head",
    PUT = "put"
}
interface LambdaEvent {
    blobs: string;
    headers: Record<string, string>;
}

declare const connectLambda: (event: LambdaEvent) => void;

type ConsistencyMode = 'eventual' | 'strong';

type Metadata = Record<string, unknown>;

interface MakeStoreRequestOptions {
    body?: BlobInput | null;
    consistency?: ConsistencyMode;
    headers?: Record<string, string>;
    key?: string;
    metadata?: Metadata;
    method: HTTPMethod;
    parameters?: Record<string, string>;
    storeName?: string;
}
interface ClientOptions {
    apiURL?: string;
    consistency?: ConsistencyMode;
    edgeURL?: string;
    fetch?: Fetcher;
    siteID: string;
    token: string;
    uncachedEdgeURL?: string;
}
interface InternalClientOptions extends ClientOptions {
    region?: string;
}
declare class Client {
    private apiURL?;
    private consistency;
    private edgeURL?;
    private fetch;
    private region?;
    private siteID;
    private token;
    private uncachedEdgeURL?;
    constructor({ apiURL, consistency, edgeURL, fetch, region, siteID, token, uncachedEdgeURL }: InternalClientOptions);
    private getFinalRequest;
    makeRequest({ body, consistency, headers: extraHeaders, key, metadata, method, parameters, storeName, }: MakeStoreRequestOptions): Promise<Response>;
}

declare const regions: {
    'us-east-1': boolean;
    'us-east-2': boolean;
    'eu-central-1': boolean;
    'ap-southeast-1': boolean;
    'ap-southeast-2': boolean;
};
type Region = keyof typeof regions;

interface BaseStoreOptions {
    client: Client;
    consistency?: ConsistencyMode;
}
interface DeployStoreOptions extends BaseStoreOptions {
    deployID: string;
    name?: string;
}
interface NamedStoreOptions extends BaseStoreOptions {
    name: string;
}
type StoreOptions = DeployStoreOptions | NamedStoreOptions;
interface GetOptions {
    consistency?: ConsistencyMode;
}
interface GetWithMetadataOptions {
    consistency?: ConsistencyMode;
    etag?: string;
}
interface GetWithMetadataResult {
    etag?: string;
    metadata: Metadata;
}
interface ListResult {
    blobs: ListResultBlob[];
    directories: string[];
}
interface ListResultBlob {
    etag: string;
    key: string;
}
interface ListOptions {
    directories?: boolean;
    paginate?: boolean;
    prefix?: string;
}
interface SetOptions {
    /**
     * Arbitrary metadata object to associate with an entry. Must be seralizable
     * to JSON.
     */
    metadata?: Metadata;
}
type BlobResponseType = 'arrayBuffer' | 'blob' | 'json' | 'stream' | 'text';
declare class Store {
    private client;
    private name;
    constructor(options: StoreOptions);
    delete(key: string): Promise<void>;
    get(key: string): Promise<string>;
    get(key: string, opts: GetOptions): Promise<string>;
    get(key: string, { type }: GetOptions & {
        type: 'arrayBuffer';
    }): Promise<ArrayBuffer>;
    get(key: string, { type }: GetOptions & {
        type: 'blob';
    }): Promise<Blob>;
    get(key: string, { type }: GetOptions & {
        type: 'json';
    }): Promise<any>;
    get(key: string, { type }: GetOptions & {
        type: 'stream';
    }): Promise<ReadableStream>;
    get(key: string, { type }: GetOptions & {
        type: 'text';
    }): Promise<string>;
    getMetadata(key: string, { consistency }?: {
        consistency?: ConsistencyMode;
    }): Promise<{
        etag: string | undefined;
        metadata: Metadata;
    } | null>;
    getWithMetadata(key: string, options?: GetWithMetadataOptions): Promise<({
        data: string;
    } & GetWithMetadataResult) | null>;
    getWithMetadata(key: string, options: {
        type: 'arrayBuffer';
    } & GetWithMetadataOptions): Promise<{
        data: ArrayBuffer;
    } & GetWithMetadataResult>;
    getWithMetadata(key: string, options: {
        type: 'blob';
    } & GetWithMetadataOptions): Promise<({
        data: Blob;
    } & GetWithMetadataResult) | null>;
    getWithMetadata(key: string, options: {
        type: 'json';
    } & GetWithMetadataOptions): Promise<({
        data: any;
    } & GetWithMetadataResult) | null>;
    getWithMetadata(key: string, options: {
        type: 'stream';
    } & GetWithMetadataOptions): Promise<({
        data: ReadableStream;
    } & GetWithMetadataResult) | null>;
    getWithMetadata(key: string, options: {
        type: 'text';
    } & GetWithMetadataOptions): Promise<({
        data: string;
    } & GetWithMetadataResult) | null>;
    list(options: ListOptions & {
        paginate: true;
    }): AsyncIterable<ListResult>;
    list(options?: ListOptions & {
        paginate?: false;
    }): Promise<ListResult>;
    set(key: string, data: BlobInput, { metadata }?: SetOptions): Promise<void>;
    setJSON(key: string, data: unknown, { metadata }?: SetOptions): Promise<void>;
    private static formatListResultBlob;
    private static validateKey;
    private static validateDeployID;
    private static validateStoreName;
    private getListIterator;
}

interface GetDeployStoreOptions extends Partial<ClientOptions> {
    deployID?: string;
    name?: string;
    region?: Region;
}
/**
 * Gets a reference to a deploy-scoped store.
 */
declare const getDeployStore: (input?: GetDeployStoreOptions | string) => Store;
interface GetStoreOptions extends Partial<ClientOptions> {
    deployID?: string;
    name?: string;
}
/**
 * Gets a reference to a store.
 *
 * @param input Either a string containing the store name or an options object
 */
declare const getStore: {
    (name: string): Store;
    (options: GetStoreOptions): Store;
};

interface ListStoresResponse {
    stores: string[];
    next_cursor?: string;
}

declare function listStores(options: Partial<ClientOptions> & {
    paginate: true;
}): AsyncIterable<ListStoresResponse>;
declare function listStores(options?: Partial<ClientOptions> & {
    paginate?: false;
}): Promise<ListStoresResponse>;

export { type BlobResponseType, type EnvironmentContext, type GetDeployStoreOptions, type GetStoreOptions, type GetWithMetadataOptions, type GetWithMetadataResult, type ListOptions, type ListResultBlob, type SetOptions, Store, type StoreOptions, connectLambda, getDeployStore, getStore, listStores, setEnvironmentContext };
