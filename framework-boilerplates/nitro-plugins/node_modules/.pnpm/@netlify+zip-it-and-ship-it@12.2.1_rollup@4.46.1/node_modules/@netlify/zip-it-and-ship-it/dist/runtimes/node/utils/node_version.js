import semver from 'semver';
// Must match the default version used in Bitballoon.
export const DEFAULT_NODE_VERSION = 22;
export const getNodeVersion = (configVersion) => parseVersion(configVersion) ?? DEFAULT_NODE_VERSION;
export const getNodeSupportMatrix = (configVersion) => {
    const versionNumber = getNodeVersion(configVersion);
    return {
        esm: versionNumber >= 14,
        awsSDKV3: versionNumber >= 18,
    };
};
// Takes a string in the format defined by the `NodeVersion` type and returns
// the numeric major version (e.g. "nodejs14.x" => 14).
export const parseVersion = (input) => {
    if (input === undefined) {
        return;
    }
    return semver.coerce(input)?.major;
};
