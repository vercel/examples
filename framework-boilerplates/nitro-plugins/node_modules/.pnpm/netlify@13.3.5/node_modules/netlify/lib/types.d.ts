import type { ReadStream } from 'node:fs';
import type { operations } from '@netlify/open-api';
import type { RequestInit } from 'node-fetch';
/**
 * Determines whether all keys in T are optional.
 */
type AreAllOptional<T> = keyof T extends never ? true : T extends Record<string, any> ? {
    [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T] extends never ? true : false : false;
/**
 * Determines whether `path` and `query` are both optional.
 */
type IsPathAndQueryOptional<K extends keyof operations> = 'parameters' extends keyof operations[K] ? AreAllOptional<'path' extends keyof operations[K]['parameters'] ? operations[K]['parameters']['path'] : object> extends true ? AreAllOptional<'query' extends keyof operations[K]['parameters'] ? operations[K]['parameters']['query'] : object> extends true ? true : false : false : true;
/**
 * Converts snake_case to camelCase for TypeScript types.
 */
type CamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<CamelCase<U>>}` : S;
/**
 * Creates a union of both snake_case and camelCase keys with their respective types.
 */
type SnakeToCamel<T> = {
    [K in keyof T as CamelCase<K & string>]: T[K];
};
/**
 * Combines snake_case and camelCase parameters into one Params type.
 */
type Params<T> = SnakeToCamel<T> | T;
type HasRequestBody<K extends keyof operations> = 'requestBody' extends keyof operations[K] ? operations[K]['requestBody'] extends {
    content: any;
} ? 'application/json' extends keyof operations[K]['requestBody']['content'] ? true : 'application/octet-stream' extends keyof operations[K]['requestBody']['content'] ? true : false : false : false;
/**
 * Extracts the request body type from the operation.
 */
type RequestBody<K extends keyof operations> = 'requestBody' extends keyof operations[K] ? operations[K]['requestBody'] extends {
    content: any;
} ? 'application/json' extends keyof operations[K]['requestBody']['content'] ? operations[K]['requestBody']['content']['application/json'] : 'application/octet-stream' extends keyof operations[K]['requestBody']['content'] ? ReadStream | (() => ReadStream) : never : never : never;
type IsRequestBodyJson<K extends keyof operations> = 'requestBody' extends keyof operations[K] ? operations[K]['requestBody'] extends {
    content: any;
} ? 'application/json' extends keyof operations[K]['requestBody']['content'] ? true : false : false : false;
type IsRequestBodyOctetStream<K extends keyof operations> = 'requestBody' extends keyof operations[K] ? operations[K]['requestBody'] extends {
    content: any;
} ? 'application/octet-stream' extends keyof operations[K]['requestBody']['content'] ? true : false : false : false;
type RequestBodyParam<K extends keyof operations> = HasRequestBody<K> extends true ? IsRequestBodyOptional<K> extends true ? DetailedRequestBodyOptional<K> : DetailedRequestBody<K> : never;
type DetailedRequestBody<K extends keyof operations> = IsRequestBodyJson<K> extends true ? {
    /**
     * The request body for `application/json`.
     * Automatically serialized to JSON based on the operation.
     * Can be a JSON object or a function returning one.
     */
    body: RequestBody<K> | (() => RequestBody<K>);
} : IsRequestBodyOctetStream<K> extends true ? {
    /**
     * The request body for `application/octet-stream`.
     * Can be a Node.js readable stream or a function returning one
     * @example
     * fs.createReadStream('./file')
     * @example
     * () => fs.createReadStream('./file')
     */
    body: ReadStream | (() => ReadStream);
} : never;
type DetailedRequestBodyOptional<K extends keyof operations> = IsRequestBodyJson<K> extends true ? {
    /**
     * The request body for `application/json`.
     * Automatically serialized to JSON based on the operation.
     * Can be a JSON object or a function returning one.
     */
    body?: RequestBody<K> | (() => RequestBody<K>);
} : IsRequestBodyOctetStream<K> extends true ? {
    /**
     * The request body for `application/octet-stream`.
     * Can be a Node.js readable stream or a function returning one
     * @example
     * fs.createReadStream('./file')
     * @example
     * () => fs.createReadStream('./file')
     */
    body?: ReadStream | (() => ReadStream);
} : never;
/**
 * Determines whether all properties in the request body are optional.
 */
type IsRequestBodyOptional<K extends keyof operations> = HasRequestBody<K> extends true ? (AreAllOptional<RequestBody<K>> extends true ? true : false) : true;
/**
 * Determines whether any parameters or request body are required.
 */
type IsParamsOrRequestBodyRequired<K extends keyof operations> = 'parameters' extends keyof operations[K] ? IsPathAndQueryOptional<K> extends true ? IsRequestBodyOptional<K> extends true ? false : true : true : false;
/**
 * Extracts and combines `path` and `query` parameters into a single type.
 */
type ExtractPathAndQueryParameters<K extends keyof operations> = 'parameters' extends keyof operations[K] ? 'path' extends keyof operations[K]['parameters'] ? 'query' extends keyof operations[K]['parameters'] ? Params<Omit<operations[K]['parameters']['path'], keyof operations[K]['parameters']['query']> & operations[K]['parameters']['query']> : Params<operations[K]['parameters']['path']> : 'query' extends keyof operations[K]['parameters'] ? Params<operations[K]['parameters']['query']> : undefined : undefined;
/**
 * Combines path, query, and request body parameters into a single type.
 */
type CombinedParamsAndRequestBody<K extends keyof operations> = HasRequestBody<K> extends true ? ExtractPathAndQueryParameters<K> & RequestBodyParam<K> : ExtractPathAndQueryParameters<K>;
type OperationParams<K extends keyof operations> = IsParamsOrRequestBodyRequired<K> extends false ? CombinedParamsAndRequestBody<K> | void | undefined : CombinedParamsAndRequestBody<K>;
type SuccessHttpStatusCodes = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
/**
 * Extracts the response type from the operation.
 */
type OperationResponse<K extends keyof operations> = 'responses' extends keyof operations[K] ? SuccessHttpStatusCodes extends infer StatusKeys ? StatusKeys extends keyof operations[K]['responses'] ? 'content' extends keyof operations[K]['responses'][StatusKeys] ? 'application/json' extends keyof operations[K]['responses'][StatusKeys]['content'] ? operations[K]['responses'][StatusKeys]['content']['application/json'] : never : never : never : never : never;
export type DynamicMethods = {
    [K in keyof operations]: (params: OperationParams<K>, 
    /**
     * Any properties you want passed to `node-fetch`.
     *
     * The `headers` property is merged with some `defaultHeaders`:
     * ```ts
     * {
     *  'User-agent': 'netlify-js-client',
     *  'accept': 'application/json',
     * }
     * ```
     *
     * @example
     * ```ts
     * const site = await client.getSite(
     *  { site_id: 'YOUR_SITE_ID' },
     *  {
     *    headers: {
     *      'X-Example-Header': 'Example Value',
     *    },
     *  },
     * )
     * ```
     */
    opts?: RequestInit | void | undefined) => Promise<OperationResponse<K>>;
};
export {};
