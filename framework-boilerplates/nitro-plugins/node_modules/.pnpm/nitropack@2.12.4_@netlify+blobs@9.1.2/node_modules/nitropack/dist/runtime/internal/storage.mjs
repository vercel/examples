import { prefixStorage } from "unstorage";
import { storage } from "#nitro-internal-virtual/storage";
export function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}
