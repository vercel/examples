import { Container } from "@azure/cosmos";
export interface AzureCosmosOptions {
    /**
     * CosmosDB endpoint in the format of https://<account>.documents.azure.com:443/.
     */
    endpoint: string;
    /**
     * CosmosDB account key. If not provided, the driver will use the DefaultAzureCredential (recommended).
     */
    accountKey?: string;
    /**
     * The name of the database to use. Defaults to `unstorage`.
     * @default "unstorage"
     */
    databaseName?: string;
    /**
     * The name of the container to use. Defaults to `unstorage`.
     * @default "unstorage"
     */
    containerName?: string;
}
export interface AzureCosmosItem {
    /**
     * The unstorage key as id of the item.
     */
    id: string;
    /**
     * The unstorage value of the item.
     */
    value: string;
    /**
     * The unstorage mtime metadata of the item.
     */
    modified: string | Date;
}
declare const _default: (opts: AzureCosmosOptions) => import("..").Driver<AzureCosmosOptions, Promise<Container>>;
export default _default;
