"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeAppPath = normalizeAppPath;
exports.normalizeRscPath = normalizeRscPath;
function normalizeAppPath(pathname) {
    return pathname.split('/').reduce((acc, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return acc;
        }
        if (segment.startsWith('(') && segment.endsWith(')')) {
            return acc;
        }
        if (segment.startsWith('@')) {
            return acc;
        }
        if (segment === 'page' && index === segments.length - 1) {
            return acc;
        }
        return acc + `/${segment}`;
    }, '');
}
function normalizeRscPath(pathname, enabled) {
    return enabled ? pathname.replace(/\.rsc($|\?)/, '') : pathname;
}

//# sourceMappingURL=app-paths.js.map