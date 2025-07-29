export interface VercelBlobOptions {
    /**
     * Whether the blob should be publicly accessible. (required, must be "public")
     */
    access: "public";
    /**
     * Prefix to prepend to all keys. Can be used for namespacing.
     */
    base?: string;
    /**
     * Rest API Token to use for connecting to your Vercel Blob store.
     * If not provided, it will be read from the environment variable `BLOB_READ_WRITE_TOKEN`.
     */
    token?: string;
    /**
     * Prefix to use for token environment variable name.
     * Default is `BLOB` (env name = `BLOB_READ_WRITE_TOKEN`).
     */
    envPrefix?: string;
}
declare const _default: (opts: VercelBlobOptions) => import("..").Driver<VercelBlobOptions, never>;
export default _default;
