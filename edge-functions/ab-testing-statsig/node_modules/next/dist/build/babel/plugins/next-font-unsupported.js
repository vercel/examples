"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = NextPageDisallowReExportAllExports;
function NextPageDisallowReExportAllExports() {
    return {
        visitor: {
            ImportDeclaration (path) {
                if ([
                    "@next/font/local",
                    "@next/font/google"
                ].includes(path.node.source.value)) {
                    var ref, ref1;
                    const err = new SyntaxError(`"@next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict`);
                    err.code = "BABEL_PARSE_ERROR";
                    err.loc = (((ref = path.node.loc) == null ? void 0 : ref.start) ?? ((ref1 = path.node.loc) == null ? void 0 : ref1.end)) ?? path.node.loc;
                    throw err;
                }
            }
        }
    };
}

//# sourceMappingURL=next-font-unsupported.js.map