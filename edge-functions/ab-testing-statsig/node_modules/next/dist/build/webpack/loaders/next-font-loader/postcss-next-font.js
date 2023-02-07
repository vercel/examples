"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _postcss = _interopRequireDefault(require("postcss"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const postcssNextFontPlugin = ({ exports , fontFamilyHash , fallbackFonts =[] , adjustFontFallback , variable , weight , style  })=>{
    return {
        postcssPlugin: "postcss-next-font",
        Once (root) {
            let fontFamily;
            const normalizeFamily = (family)=>{
                return family.replace(/['"]/g, "");
            };
            const formatFamily = (family)=>{
                // Turn the font family unguessable to make it localy scoped
                return `'__${family.replace(/ /g, "_")}_${fontFamilyHash}'`;
            };
            // Hash font-family names
            for (const node of root.nodes){
                if (node.type === "atrule" && node.name === "font-face") {
                    const familyNode = node.nodes.find((decl)=>decl.prop === "font-family");
                    if (!familyNode) {
                        continue;
                    }
                    if (!fontFamily) {
                        fontFamily = normalizeFamily(familyNode.value);
                    }
                    familyNode.value = formatFamily(fontFamily);
                }
            }
            if (!fontFamily) {
                throw new Error("Font loaders must return one or more @font-face's");
            }
            // Add fallback font with override values
            let adjustFontFallbackFamily;
            if (adjustFontFallback) {
                adjustFontFallbackFamily = formatFamily(`${fontFamily} Fallback`);
                const fallbackFontFace = _postcss.default.atRule({
                    name: "font-face"
                });
                const { fallbackFont , ascentOverride , descentOverride , lineGapOverride , sizeAdjust ,  } = adjustFontFallback;
                fallbackFontFace.nodes = [
                    new _postcss.default.Declaration({
                        prop: "font-family",
                        value: adjustFontFallbackFamily
                    }),
                    new _postcss.default.Declaration({
                        prop: "src",
                        value: `local("${fallbackFont}")`
                    }),
                    ...ascentOverride ? [
                        new _postcss.default.Declaration({
                            prop: "ascent-override",
                            value: ascentOverride
                        }), 
                    ] : [],
                    ...descentOverride ? [
                        new _postcss.default.Declaration({
                            prop: "descent-override",
                            value: descentOverride
                        }), 
                    ] : [],
                    ...lineGapOverride ? [
                        new _postcss.default.Declaration({
                            prop: "line-gap-override",
                            value: lineGapOverride
                        }), 
                    ] : [],
                    ...sizeAdjust ? [
                        new _postcss.default.Declaration({
                            prop: "size-adjust",
                            value: sizeAdjust
                        }), 
                    ] : [], 
                ];
                root.nodes.push(fallbackFontFace);
            }
            // Variable fonts can define ranges of values
            const isRange = (value)=>value.trim().includes(" ");
            const formattedFontFamilies = [
                formatFamily(fontFamily),
                ...adjustFontFallbackFamily ? [
                    adjustFontFallbackFamily
                ] : [],
                ...fallbackFonts, 
            ].join(", ");
            // Add class with family, weight and style
            const classRule = new _postcss.default.Rule({
                selector: ".className"
            });
            classRule.nodes = [
                new _postcss.default.Declaration({
                    prop: "font-family",
                    value: formattedFontFamilies
                }),
                ...weight && !isRange(weight) ? [
                    new _postcss.default.Declaration({
                        prop: "font-weight",
                        value: weight
                    }), 
                ] : [],
                ...style && !isRange(style) ? [
                    new _postcss.default.Declaration({
                        prop: "font-style",
                        value: style
                    }), 
                ] : [], 
            ];
            root.nodes.push(classRule);
            // Add class that defines a variable with the font family
            if (variable) {
                const varialbeRule = new _postcss.default.Rule({
                    selector: ".variable"
                });
                varialbeRule.nodes = [
                    new _postcss.default.Declaration({
                        prop: variable,
                        value: formattedFontFamilies
                    }), 
                ];
                root.nodes.push(varialbeRule);
            }
            // Export @font-face values as is
            exports.push({
                name: "style",
                value: {
                    fontFamily: formattedFontFamilies,
                    fontWeight: !Number.isNaN(Number(weight)) ? Number(weight) : undefined,
                    fontStyle: style && !isRange(style) ? style : undefined
                }
            });
        }
    };
};
postcssNextFontPlugin.postcss = true;
var _default = postcssNextFontPlugin;
exports.default = _default;

//# sourceMappingURL=postcss-next-font.js.map