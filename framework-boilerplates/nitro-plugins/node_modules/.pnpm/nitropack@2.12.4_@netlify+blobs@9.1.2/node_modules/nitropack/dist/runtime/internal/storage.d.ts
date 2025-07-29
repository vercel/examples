import type { Storage, StorageValue } from "unstorage";
export declare function useStorage<T extends StorageValue = StorageValue>(base?: string): Storage<T>;
