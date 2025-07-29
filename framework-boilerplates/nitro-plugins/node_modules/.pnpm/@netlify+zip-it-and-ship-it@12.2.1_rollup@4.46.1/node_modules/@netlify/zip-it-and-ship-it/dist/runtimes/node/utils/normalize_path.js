import { normalize, sep } from 'path';
import unixify from 'unixify';
// `adm-zip` and `require()` expect Unix paths.
// We remove the common path prefix.
// With files on different Windows drives, we remove the drive letter.
export const normalizeFilePath = function ({ commonPrefix, path, userNamespace, }) {
    const userNamespacePathSegment = userNamespace ? `${userNamespace}${sep}` : '';
    const pathA = normalize(path);
    const pathB = pathA.replace(commonPrefix, userNamespacePathSegment);
    const pathC = unixify(pathB);
    return pathC;
};
