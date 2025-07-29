import { UTApi } from "uploadthing/server";
type UTApiOptions = Omit<Exclude<ConstructorParameters<typeof UTApi>[0], undefined>, "defaultKeyType">;
export interface UploadThingOptions extends UTApiOptions {
    /** base key to add to keys */
    base?: string;
}
declare const _default: (opts: UploadThingOptions) => import("..").Driver<UploadThingOptions, UTApi>;
export default _default;
