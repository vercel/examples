import { DEFAULT_NODE_VERSION, parseVersion } from './node_version.js';
const validRuntimeMap = {
    14: 'nodejs14.x',
    16: 'nodejs16.x',
    18: 'nodejs18.x',
    20: 'nodejs20.x',
    22: 'nodejs22.x',
};
const minimumV2Version = 18;
export const getNodeRuntime = (input) => {
    const version = parseVersion(input);
    // return undefined to defer the version selection to BB/FO
    if (!version || !(version in validRuntimeMap)) {
        return;
    }
    return validRuntimeMap[version];
};
export const getNodeRuntimeForV2 = (input) => {
    const version = parseVersion(input);
    // If version was unable to be parsed or if the version is older than Node.js 18
    // we return the current default Node.js version (which was Node.js 22 while writing this).
    // Here we do not want BB/FO to decide on the version, because they value AWS_LAMBDA_JS_RUNTIME, which
    // might be set to an too old version
    if (!version || version < minimumV2Version) {
        return validRuntimeMap[DEFAULT_NODE_VERSION];
    }
    // We already know that the version is Node.js 18 or newer, because of the above statement. So if
    // we do not have it in the runtime map, we can defer to the default version handling in BB/FO.
    // This works because we know that the `input` is the value of `AWS_LAMBDA_JS_RUNTIME` set by build.
    if (!(version in validRuntimeMap)) {
        return;
    }
    return validRuntimeMap[version];
};
