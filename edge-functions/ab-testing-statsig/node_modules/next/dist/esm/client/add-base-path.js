import { addPathPrefix } from '../shared/lib/router/utils/add-path-prefix';
import { normalizePathTrailingSlash } from './normalize-trailing-slash';
const basePath = process.env.__NEXT_ROUTER_BASEPATH || '';
export function addBasePath(path, required) {
    if (process.env.__NEXT_MANUAL_CLIENT_BASE_PATH) {
        if (!required) {
            return path;
        }
    }
    return normalizePathTrailingSlash(addPathPrefix(path, basePath));
}

//# sourceMappingURL=add-base-path.js.map