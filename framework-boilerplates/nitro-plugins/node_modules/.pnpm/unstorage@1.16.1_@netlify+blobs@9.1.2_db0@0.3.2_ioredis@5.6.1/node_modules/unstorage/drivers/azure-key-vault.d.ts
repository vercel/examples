import { SecretClient, type SecretClientOptions } from "@azure/keyvault-secrets";
export interface AzureKeyVaultOptions {
    /**
     * The name of the key vault to use.
     */
    vaultName: string;
    /**
     * Version of the Azure Key Vault service to use. Defaults to 7.3.
     * @default '7.3'
     */
    serviceVersion?: SecretClientOptions["serviceVersion"];
    /**
     * The number of entries to retrieve per request. Impacts getKeys() and clear() performance. Maximum value is 25.
     * @default 25
     */
    pageSize?: number;
}
declare const _default: (opts: AzureKeyVaultOptions) => import("..").Driver<AzureKeyVaultOptions, SecretClient>;
export default _default;
