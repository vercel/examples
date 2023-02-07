"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isBlockedPage = isBlockedPage;
exports.cleanAmpPath = cleanAmpPath;
var _constants = require("../shared/lib/constants");
function isBlockedPage(pathname) {
    return _constants.BLOCKED_PAGES.includes(pathname);
}
function cleanAmpPath(pathname) {
    if (pathname.match(/\?amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/\?amp=(y|yes|true|1)&?/, "?");
    }
    if (pathname.match(/&amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/&amp=(y|yes|true|1)/, "");
    }
    pathname = pathname.replace(/\?$/, "");
    return pathname;
}

//# sourceMappingURL=utils.js.map