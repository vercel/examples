export interface CloudflareR2Options {
    binding?: string | R2Bucket;
    base?: string;
}
declare const _default: (opts: CloudflareR2Options | undefined) => import("..").Driver<CloudflareR2Options | undefined, R2Bucket>;
export default _default;
