import { AppConfigurationClient } from "@azure/app-configuration";
export interface AzureAppConfigurationOptions {
    /**
     * Optional prefix for keys. This can be used to isolate keys from different applications in the same Azure App Configuration instance. E.g. "app01" results in keys like "app01:foo" and "app01:bar".
     * @default null
     */
    prefix?: string;
    /**
     * Optional label for keys. If not provided, all keys will be created and listed without labels. This can be used to isolate keys from different environments in the same Azure App Configuration instance. E.g. "dev" results in keys like "foo" and "bar" with the label "dev".
     * @default '\0'
     */
    label?: string;
    /**
     * Optional endpoint to use when connecting to Azure App Configuration. If not provided, the appConfigName option must be provided. If both are provided, the endpoint option takes precedence.
     * @default null
     */
    endpoint?: string;
    /**
     * Optional name of the Azure App Configuration instance to connect to. If not provided, the endpoint option must be provided. If both are provided, the endpoint option takes precedence.
     * @default null
     */
    appConfigName?: string;
    /**
     * Optional connection string to use when connecting to Azure App Configuration. If not provided, the endpoint option must be provided. If both are provided, the endpoint option takes precedence.
     * @default null
     */
    connectionString?: string;
}
declare const _default: (opts: AzureAppConfigurationOptions | undefined) => import("..").Driver<AzureAppConfigurationOptions | undefined, AppConfigurationClient>;
export default _default;
