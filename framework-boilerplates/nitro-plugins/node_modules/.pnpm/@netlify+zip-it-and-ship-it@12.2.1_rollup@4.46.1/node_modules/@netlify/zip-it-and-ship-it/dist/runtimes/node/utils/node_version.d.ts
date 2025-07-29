export interface NodeVersionSupport {
    esm: boolean;
    awsSDKV3: boolean;
}
export declare const DEFAULT_NODE_VERSION = 22;
export declare const getNodeVersion: (configVersion?: string) => number;
export declare const getNodeSupportMatrix: (configVersion?: string) => NodeVersionSupport;
export declare const parseVersion: (input: string | undefined) => number | undefined;
