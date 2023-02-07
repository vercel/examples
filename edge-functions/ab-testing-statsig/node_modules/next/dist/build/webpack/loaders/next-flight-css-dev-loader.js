"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pitch = pitch;
exports.default = void 0;
function pitch() {
    if (process.env.NODE_ENV !== "production") {
        const content = this.fs.readFileSync(this.resourcePath);
        this.data.__checksum = (typeof content === "string" ? Buffer.from(content) : content).toString("hex");
    }
}
const NextServerCSSLoader = function(content) {
    this.cacheable && this.cacheable();
    // Only add the checksum during development.
    if (process.env.NODE_ENV !== "production") {
        const isCSSModule = this.resourcePath.match(/\.module\.(css|sass|scss)$/);
        if (isCSSModule) {
            return content + "\nmodule.exports.__checksum = " + JSON.stringify(this.data.__checksum);
        }
        return `export default ${JSON.stringify(this.data.__checksum)}`;
    }
    return content;
};
var _default = NextServerCSSLoader;
exports.default = _default;

//# sourceMappingURL=next-flight-css-dev-loader.js.map