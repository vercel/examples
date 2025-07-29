import { PonyfillBlob } from './Blob.cjs';
import { PonyfillReadableStream } from './ReadableStream.cjs';
export declare class PonyfillFormData implements FormData {
    private map;
    append(name: string, value: string): void;
    append(name: string, value: PonyfillBlob, fileName?: string): void;
    delete(name: string): void;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    set(name: string, value: PonyfillBlob, fileName?: string): void;
    [Symbol.iterator](): FormDataIterator<[string, FormDataEntryValue]>;
    _entries(): FormDataIterator<[string, FormDataEntryValue]>;
    entries(): FormDataIterator<[string, FormDataEntryValue]>;
    _keys(): IterableIterator<string>;
    keys(): FormDataIterator<string>;
    _values(): IterableIterator<FormDataEntryValue>;
    values(): FormDataIterator<FormDataEntryValue>;
    forEach(callback: (value: FormDataEntryValue, key: string, parent: this) => void): void;
}
export declare function getStreamFromFormData(formData: FormData, boundary?: string): PonyfillReadableStream<Uint8Array>;
