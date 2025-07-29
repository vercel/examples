import { LRUCache } from "lru-cache";
type LRUCacheOptions = LRUCache.OptionsBase<string, any, any> & Partial<LRUCache.OptionsMaxLimit<string, any, any>> & Partial<LRUCache.OptionsSizeLimit<string, any, any>> & Partial<LRUCache.OptionsTTLLimit<string, any, any>>;
export interface LRUDriverOptions extends LRUCacheOptions {
}
declare const _default: (opts: LRUDriverOptions | undefined) => import("..").Driver<LRUDriverOptions | undefined, LRUCache<string, any, any>>;
export default _default;
