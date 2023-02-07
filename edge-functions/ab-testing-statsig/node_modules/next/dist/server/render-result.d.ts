/// <reference types="node" />
/// <reference types="node" />
import type { ServerResponse } from 'http';
import { Writable } from 'stream';
declare type ContentTypeOption = string | undefined;
export default class RenderResult {
    private _result;
    private _contentType;
    constructor(response: string | ReadableStream<Uint8Array>, { contentType }?: {
        contentType?: ContentTypeOption;
    });
    contentType(): ContentTypeOption;
    toUnchunkedString(): string;
    pipe(res: ServerResponse | Writable): Promise<void>;
    isDynamic(): boolean;
    static fromStatic(value: string): RenderResult;
    static empty: RenderResult;
}
export {};
