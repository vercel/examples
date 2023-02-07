"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = nextFontLoader;
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _loaderUtils3 = _interopRequireDefault(require("next/dist/compiled/loader-utils3"));
var _postcssNextFont = _interopRequireDefault(require("./postcss-next-font"));
var _util = require("util");
var _constants = require("../../../../shared/lib/constants");
async function nextFontLoader() {
    const fontLoaderSpan = this.currentTraceSpan.traceChild("next-font-loader");
    return fontLoaderSpan.traceAsyncFn(async ()=>{
        const callback = this.async();
        // next-swc next_font_loaders turns each font loader call into JSON
        const { path: relativeFilePathFromRoot , import: functionName , arguments: data , variableName ,  } = JSON.parse(this.resourceQuery.slice(1));
        // Throw error if @next/font is used in _document.js
        if (/pages[\\/]_document\./.test(relativeFilePathFromRoot)) {
            const err = new Error(`${_chalk.default.bold("Cannot")} be used within ${_chalk.default.cyan("pages/_document.js")}.`);
            err.name = "NextFontError";
            callback(err);
            return;
        }
        const { isDev , isServer , assetPrefix , fontLoaderOptions , postcss: getPostcss ,  } = this.getOptions();
        const nextConfigPaths = _constants.CONFIG_FILES.map((config)=>_path.default.join(this.rootContext, config));
        // Add next.config.js as a dependency, loaders must rerun in case options changed
        await Promise.all(nextConfigPaths.map(async (configPath)=>{
            const hasConfig = await _fs.promises.access(configPath).then(()=>true, ()=>false);
            if (hasConfig) {
                this.addDependency(configPath);
            } else {
                this.addMissingDependency(configPath);
            }
        }));
        const emitFontFile = (content, ext, preload)=>{
            const opts = {
                context: this.rootContext,
                content
            };
            const interpolatedName = _loaderUtils3.default.interpolateName(this, // Font files ending with .p.(woff|woff2|eot|ttf|otf) are preloaded
            `static/media/[hash]${preload ? ".p" : ""}.${ext}`, opts);
            const outputPath = `${assetPrefix}/_next/${interpolatedName}`;
            if (!isServer) {
                this.emitFile(interpolatedName, content, null);
            }
            return outputPath;
        };
        try {
            const fontLoader = require(_path.default.join(this.resourcePath, "../loader.js")).default;
            let { css , fallbackFonts , adjustFontFallback , weight , style , variable  } = await fontLoader({
                functionName,
                variableName,
                data,
                config: fontLoaderOptions,
                emitFontFile,
                resolve: (src)=>(0, _util).promisify(this.resolve)(_path.default.dirname(_path.default.join(this.rootContext, relativeFilePathFromRoot)), src.startsWith(".") ? src : `./${src}`),
                isDev,
                isServer,
                loaderContext: this
            });
            const { postcss  } = await getPostcss();
            // Exports will be exported as is from css-loader instead of a CSS module export
            const exports = [];
            const fontFamilyHash = _loaderUtils3.default.getHashDigest(Buffer.from(css), "md5", "hex", 6);
            // Add CSS classes, exports and make the font-family localy scoped by turning it unguessable
            const result = await postcss((0, _postcssNextFont).default({
                exports,
                fontFamilyHash,
                fallbackFonts,
                weight,
                style,
                adjustFontFallback,
                variable
            })).process(css, {
                from: undefined
            });
            // Reuse ast in css-loader
            const ast = {
                type: "postcss",
                version: result.processor.version,
                root: result.root
            };
            callback(null, result.css, null, {
                exports,
                ast,
                fontFamilyHash
            });
        } catch (err) {
            callback(err);
        }
    });
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map