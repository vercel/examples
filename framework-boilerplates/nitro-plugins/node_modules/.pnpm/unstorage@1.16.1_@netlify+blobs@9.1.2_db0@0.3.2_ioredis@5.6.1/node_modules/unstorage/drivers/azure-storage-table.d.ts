import { TableClient } from "@azure/data-tables";
export interface AzureStorageTableOptions {
    /**
     * The name of the Azure Storage account.
     */
    accountName: string;
    /**
     * The name of the table. All entities will be stored in the same table.
     * @default 'unstorage'
     */
    tableName?: string;
    /**
     * The partition key. All entities will be stored in the same partition.
     * @default 'unstorage'
     */
    partitionKey?: string;
    /**
     * The account key. If provided, the SAS key will be ignored. Only available in Node.js runtime.
     */
    accountKey?: string;
    /**
     * The SAS key. If provided, the account key will be ignored.
     */
    sasKey?: string;
    /**
     * The connection string. If provided, the account key and SAS key will be ignored. Only available in Node.js runtime.
     */
    connectionString?: string;
    /**
     * The number of entries to retrive per request. Impacts getKeys() and clear() performance. Maximum value is 1000.
     * @default 1000
     */
    pageSize?: number;
}
declare const _default: (opts: AzureStorageTableOptions) => import("..").Driver<AzureStorageTableOptions, TableClient>;
export default _default;
