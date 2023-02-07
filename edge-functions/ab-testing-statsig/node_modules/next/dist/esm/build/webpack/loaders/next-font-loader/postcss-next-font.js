import postcss from "postcss";
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
                const fallbackFontFace = postcss.atRule({
                    name: "font-face"
                });
                const { fallbackFont , ascentOverride , descentOverride , lineGapOverride , sizeAdjust ,  } = adjustFontFallback;
                fallbackFontFace.nodes = [
                    new postcss.Declaration({
                        prop: "font-family",
                        value: adjustFontFallbackFamily
                    }),
                    new postcss.Declaration({
                        prop: "src",
                        value: `local("${fallbackFont}")`
                    }),
                    ...ascentOverride ? [
                        new postcss.Declaration({
                            prop: "ascent-override",
                            value: ascentOverride
                        }), 
                    ] : [],
                    ...descentOverride ? [
                        new postcss.Declaration({
                            prop: "descent-override",
                            value: descentOverride
                        }), 
                    ] : [],
                    ...lineGapOverride ? [
                        new postcss.Declaration({
                            prop: "line-gap-override",
                            value: lineGapOverride
                        }), 
                    ] : [],
                    ...sizeAdjust ? [
                        new postcss.Declaration({
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
            const classRule = new postcss.Rule({
                selector: ".className"
            });
            classRule.nodes = [
                new postcss.Declaration({
                    prop: "font-family",
                    value: formattedFontFamilies
                }),
                ...weight && !isRange(weight) ? [
                    new postcss.Declaration({
                        prop: "font-weight",
                        value: weight
                    }), 
                ] : [],
                ...style && !isRange(style) ? [
                    new postcss.Declaration({
                        prop: "font-style",
                        value: style
                    }), 
                ] : [], 
            ];
            root.nodes.push(classRule);
            // Add class that defines a variable with the font family
            if (variable) {
                const varialbeRule = new postcss.Rule({
                    selector: ".variable"
                });
                varialbeRule.nodes = [
                    new postcss.Declaration({
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
export default postcssNextFontPlugin;

//# sourceMappingURL=postcss-next-font.js.map