export interface S3DriverOptions {
    /**
     * Access Key ID
     */
    accessKeyId: string;
    /**
     * Secret Access Key
     */
    secretAccessKey: string;
    /**
     * The endpoint URL of the S3 service.
     *
     * - For AWS S3: "https://s3.[region].amazonaws.com/"
     * - For cloudflare R2: "https://[uid].r2.cloudflarestorage.com/"
     */
    endpoint: string;
    /**
     * The region of the S3 bucket.
     *
     * - For AWS S3, this is the region of the bucket.
     * - For cloudflare, this is can be set to `auto`.
     */
    region: string;
    /**
     * The name of the bucket.
     */
    bucket: string;
    /**
     * Enabled by default to speedup `clear()` operation. Set to `false` if provider is not implementing [DeleteObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html).
     */
    bulkDelete?: boolean;
}
declare const _default: (opts: S3DriverOptions) => import("..").Driver<S3DriverOptions, never>;
export default _default;
