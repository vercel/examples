import { ContainerClient } from "@azure/storage-blob";
export interface AzureStorageBlobOptions {
    /**
     * The name of the Azure Storage account.
     */
    accountName?: string;
    /**
     * The name of the storage container. All entities will be stored in the same container. Will be created if it doesn't exist.
     * @default "unstorage"
     */
    containerName?: string;
    /**
     * The account key. If provided, the SAS key will be ignored. Only available in Node.js runtime.
     */
    accountKey?: string;
    /**
     * The SAS token. If provided, the account key will be ignored. Include at least read, list and write permissions to be able to list keys.
     */
    sasKey?: string;
    /**
     * The SAS URL. If provided, the account key, SAS key and container name will be ignored.
     */
    sasUrl?: string;
    /**
     * The connection string. If provided, the account key and SAS key will be ignored. Only available in Node.js runtime.
     */
    connectionString?: string;
    /**
     * Storage account endpoint suffix. Need to be changed for Microsoft Azure operated by 21Vianet, Azure Government or Azurite.
     * @default ".blob.core.windows.net"
     */
    endpointSuffix?: string;
}
declare const _default: (opts: AzureStorageBlobOptions) => import("..").Driver<AzureStorageBlobOptions, ContainerClient>;
export default _default;
