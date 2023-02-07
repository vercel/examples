"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFontDefinitionFromNetwork = getFontDefinitionFromNetwork;
exports.getFontDefinitionFromManifest = getFontDefinitionFromManifest;
exports.calculateOverrideValues = calculateOverrideValues;
exports.calculateSizeAdjustValues = calculateSizeAdjustValues;
exports.getFontOverrideCss = getFontOverrideCss;
var Log = _interopRequireWildcard(require("../build/output/log"));
var _constants = require("../shared/lib/constants");
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const googleFontsMetrics = require("./google-font-metrics.json");
const https = require("https");
const CHROME_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36";
const IE_UA = "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko";
function isGoogleFont(url) {
    return url.startsWith(_constants.GOOGLE_FONT_PROVIDER);
}
function getFontForUA(url, UA) {
    return new Promise((resolve, reject)=>{
        let rawData = "";
        https.get(url, {
            headers: {
                "user-agent": UA
            }
        }, (res)=>{
            res.on("data", (chunk)=>{
                rawData += chunk;
            });
            res.on("end", ()=>{
                resolve(rawData.toString("utf8"));
            });
        }).on("error", (e)=>{
            reject(e);
        });
    });
}
async function getFontDefinitionFromNetwork(url) {
    let result = "";
    /**
   * The order of IE -> Chrome is important, other wise chrome starts loading woff1.
   * CSS cascading 🤷‍♂️.
   */ try {
        if (isGoogleFont(url)) {
            result += await getFontForUA(url, IE_UA);
        }
        result += await getFontForUA(url, CHROME_UA);
    } catch (e) {
        Log.warn(`Failed to download the stylesheet for ${url}. Skipped optimizing this font.`);
        return "";
    }
    return result;
}
function getFontDefinitionFromManifest(url, manifest) {
    var ref;
    return ((ref = manifest.find((font)=>{
        if (font && font.url === url) {
            return true;
        }
        return false;
    })) == null ? void 0 : ref.content) || "";
}
function parseGoogleFontName(css) {
    const regex = /font-family: ([^;]*)/g;
    const matches = css.matchAll(regex);
    const fontNames = new Set();
    for (let font of matches){
        const fontFamily = font[1].replace(/^['"]|['"]$/g, "");
        fontNames.add(fontFamily);
    }
    return [
        ...fontNames
    ];
}
function formatOverrideValue(val) {
    return Math.abs(val * 100).toFixed(2);
}
function calculateOverrideValues(fontMetrics) {
    let { category , ascent , descent , lineGap , unitsPerEm  } = fontMetrics;
    const fallbackFont = category === "serif" ? _constants.DEFAULT_SERIF_FONT : _constants.DEFAULT_SANS_SERIF_FONT;
    ascent = formatOverrideValue(ascent / unitsPerEm);
    descent = formatOverrideValue(descent / unitsPerEm);
    lineGap = formatOverrideValue(lineGap / unitsPerEm);
    return {
        ascent,
        descent,
        lineGap,
        fallbackFont: fallbackFont.name
    };
}
function calculateSizeAdjustValues(fontMetrics) {
    let { category , ascent , descent , lineGap , unitsPerEm , azAvgWidth  } = fontMetrics;
    const fallbackFont = category === "serif" ? _constants.DEFAULT_SERIF_FONT : _constants.DEFAULT_SANS_SERIF_FONT;
    const mainFontAvgWidth = azAvgWidth / unitsPerEm;
    const fallbackFontAvgWidth = fallbackFont.azAvgWidth / fallbackFont.unitsPerEm;
    let sizeAdjust = azAvgWidth ? mainFontAvgWidth / fallbackFontAvgWidth : 1;
    ascent = formatOverrideValue(ascent / (unitsPerEm * sizeAdjust));
    descent = formatOverrideValue(descent / (unitsPerEm * sizeAdjust));
    lineGap = formatOverrideValue(lineGap / (unitsPerEm * sizeAdjust));
    return {
        ascent,
        descent,
        lineGap,
        fallbackFont: fallbackFont.name,
        sizeAdjust: formatOverrideValue(sizeAdjust)
    };
}
function calculateOverrideCSS(font, fontMetrics) {
    const fontName = font.trim();
    const { ascent , descent , lineGap , fallbackFont  } = calculateOverrideValues(fontMetrics[fontName]);
    return `
    @font-face {
      font-family: "${fontName} Fallback";
      ascent-override: ${ascent}%;
      descent-override: ${descent}%;
      line-gap-override: ${lineGap}%;
      src: local("${fallbackFont}");
    }
  `;
}
function calculateSizeAdjustCSS(font, fontMetrics) {
    const fontName = font.trim();
    const { ascent , descent , lineGap , fallbackFont , sizeAdjust  } = calculateSizeAdjustValues(fontMetrics[fontName]);
    return `
    @font-face {
      font-family: "${fontName} Fallback";
      ascent-override: ${ascent}%;
      descent-override: ${descent}%;
      line-gap-override: ${lineGap}%;
      size-adjust: ${sizeAdjust}%;
      src: local("${fallbackFont}");
    }
  `;
}
function getFontOverrideCss(url, css, useSizeAdjust = false) {
    if (!isGoogleFont(url)) {
        return "";
    }
    const calcFn = useSizeAdjust ? calculateSizeAdjustCSS : calculateOverrideCSS;
    try {
        const fontNames = parseGoogleFontName(css);
        const fontMetrics = googleFontsMetrics;
        const fontCss = fontNames.reduce((cssStr, fontName)=>{
            cssStr += calcFn(fontName, fontMetrics);
            return cssStr;
        }, "");
        return fontCss;
    } catch (e) {
        console.log("Error getting font override values - ", e);
        return "";
    }
}

//# sourceMappingURL=font-utils.js.map