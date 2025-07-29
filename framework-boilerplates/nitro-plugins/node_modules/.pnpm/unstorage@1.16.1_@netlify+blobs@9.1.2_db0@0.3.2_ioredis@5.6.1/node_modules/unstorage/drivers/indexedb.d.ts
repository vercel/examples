export interface IDBKeyvalOptions {
    base?: string;
    dbName?: string;
    storeName?: string;
}
declare const _default: (opts: IDBKeyvalOptions | undefined) => import("..").Driver<IDBKeyvalOptions | undefined, never>;
export default _default;
