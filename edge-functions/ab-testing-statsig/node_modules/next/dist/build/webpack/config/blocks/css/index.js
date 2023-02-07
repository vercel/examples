"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.lazyPostCSS = lazyPostCSS;
exports.css = exports.regexLikeCss = void 0;
var _path = _interopRequireDefault(require("path"));
var _lodashCurry = _interopRequireDefault(require("next/dist/compiled/lodash.curry"));
var _helpers = require("../../helpers");
var _utils = require("../../utils");
var _loaders = require("./loaders");
var _nextFont = require("./loaders/next-font");
var _messages = require("./messages");
var _plugins = require("./plugins");
var _nonNullable = require("../../../../../lib/non-nullable");
var _constants = require("../../../../../lib/constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const regexLikeCss = /\.(css|scss|sass)$/;
exports.regexLikeCss = regexLikeCss;
// RegExps for Style Sheets
const regexCssGlobal = /(?<!\.module)\.css$/;
const regexCssModules = /\.module\.css$/;
// RegExps for Syntactically Awesome Style Sheets
const regexSassGlobal = /(?<!\.module)\.(scss|sass)$/;
const regexSassModules = /\.module\.(scss|sass)$/;
/**
 * Mark a rule as removable if built-in CSS support is disabled
 *
 * @param {webpack.RuleSetRule} r the rule to mark
 *
 * @returns {webpack.RuleSetRule} the marked rule
 */ function markRemovable(r) {
    Object.defineProperty(r, Symbol.for("__next_css_remove"), {
        enumerable: false,
        value: true
    });
    return r;
}
let postcssInstancePromise;
async function lazyPostCSS(rootDirectory, supportedBrowsers, disablePostcssPresetEnv) {
    if (!postcssInstancePromise) {
        postcssInstancePromise = (async ()=>{
            const postcss = require("postcss");
            // @ts-ignore backwards compat
            postcss.plugin = function postcssPlugin(name, initializer) {
                function creator(...args) {
                    let transformer = initializer(...args);
                    transformer.postcssPlugin = name;
                    // transformer.postcssVersion = new Processor().version
                    return transformer;
                }
                let cache;
                Object.defineProperty(creator, "postcss", {
                    get () {
                        if (!cache) cache = creator();
                        return cache;
                    }
                });
                creator.process = function(css1, processOpts, pluginOpts) {
                    return postcss([
                        creator(pluginOpts)
                    ]).process(css1, processOpts);
                };
                return creator;
            };
            // @ts-ignore backwards compat
            postcss.vendor = {
                /**
         * Returns the vendor prefix extracted from an input string.
         *
         * @param {string} prop String with or without vendor prefix.
         *
         * @return {string} vendor prefix or empty string
         *
         * @example
         * postcss.vendor.prefix('-moz-tab-size') //=> '-moz-'
         * postcss.vendor.prefix('tab-size')      //=> ''
         */ prefix: function prefix(prop) {
                    const match = prop.match(/^(-\w+-)/);
                    if (match) {
                        return match[0];
                    }
                    return "";
                },
                /**
         * Returns the input string stripped of its vendor prefix.
         *
         * @param {string} prop String with or without vendor prefix.
         *
         * @return {string} String name without vendor prefixes.
         *
         * @example
         * postcss.vendor.unprefixed('-moz-tab-size') //=> 'tab-size'
         */ unprefixed: function unprefixed(prop) {
                    return prop.replace(/^-\w+-/, "");
                }
            };
            const postCssPlugins = await (0, _plugins).getPostCssPlugins(rootDirectory, supportedBrowsers, disablePostcssPresetEnv);
            return {
                postcss,
                postcssWithPlugins: postcss(postCssPlugins)
            };
        })();
    }
    return postcssInstancePromise;
}
const css = (0, _lodashCurry).default(async function css(ctx, config) {
    const { prependData: sassPrependData , additionalData: sassAdditionalData , ...sassOptions } = ctx.sassOptions;
    const lazyPostCSSInitializer = ()=>lazyPostCSS(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv);
    const sassPreprocessors = [
        // First, process files with `sass-loader`: this inlines content, and
        // compiles away the proprietary syntax.
        {
            loader: require.resolve("next/dist/compiled/sass-loader"),
            options: {
                // Source maps are required so that `resolve-url-loader` can locate
                // files original to their source directory.
                sourceMap: true,
                sassOptions,
                additionalData: sassPrependData || sassAdditionalData
            }
        },
        // Then, `sass-loader` will have passed-through CSS imports as-is instead
        // of inlining them. Because they were inlined, the paths are no longer
        // correct.
        // To fix this, we use `resolve-url-loader` to rewrite the CSS
        // imports to real file paths.
        {
            loader: require.resolve("../../../loaders/resolve-url-loader/index"),
            options: {
                postcss: lazyPostCSSInitializer,
                // Source maps are not required here, but we may as well emit
                // them.
                sourceMap: true
            }
        }, 
    ];
    const fns = [];
    // Resolve the configured font loaders, the resolved files are noop files that next-font-loader will match
    let fontLoaders = ctx.experimental.fontLoaders ? ctx.experimental.fontLoaders.map(({ loader: fontLoader , options  })=>[
            _path.default.join(require.resolve(fontLoader), "../target.css"),
            options, 
        ]) : undefined;
    fontLoaders == null ? void 0 : fontLoaders.forEach(([fontLoaderPath, fontLoaderOptions])=>{
        // Matches the resolved font loaders noop files to run next-font-loader
        fns.push((0, _helpers).loader({
            oneOf: [
                markRemovable({
                    sideEffects: false,
                    test: fontLoaderPath,
                    use: (0, _nextFont).getNextFontLoader(ctx, lazyPostCSSInitializer, fontLoaderOptions)
                }), 
            ]
        }));
    });
    // CSS cannot be imported in _document. This comes before everything because
    // global CSS nor CSS modules work in said file.
    fns.push((0, _helpers).loader({
        oneOf: [
            markRemovable({
                test: regexLikeCss,
                // Use a loose regex so we don't have to crawl the file system to
                // find the real file name (if present).
                issuer: /pages[\\/]_document\./,
                use: {
                    loader: "error-loader",
                    options: {
                        reason: (0, _messages).getCustomDocumentError()
                    }
                }
            }), 
        ]
    }));
    const shouldIncludeExternalCSSImports = !!ctx.experimental.craCompat || !!ctx.experimental.transpilePackages;
    // CSS modules & SASS modules support. They are allowed to be imported in anywhere.
    fns.push(// CSS Modules should never have side effects. This setting will
    // allow unused CSS to be removed from the production build.
    // We ensure this by disallowing `:global()` CSS at the top-level
    // via the `pure` mode in `css-loader`.
    (0, _helpers).loader({
        oneOf: [
            // For app dir, it has to match one of the 2 layers and then apply a
            // specific loader.
            ctx.hasAppDir && !ctx.isProduction ? markRemovable({
                sideEffects: false,
                test: regexCssModules,
                issuerLayer: {
                    or: [
                        _constants.WEBPACK_LAYERS.server,
                        _constants.WEBPACK_LAYERS.client
                    ]
                },
                use: [
                    require.resolve("../../../loaders/next-flight-css-dev-loader"),
                    ...(0, _loaders).getCssModuleLoader(ctx, lazyPostCSSInitializer), 
                ]
            }) : null,
            ctx.hasAppDir && !ctx.isServer ? markRemovable({
                sideEffects: false,
                test: regexCssModules,
                use: [
                    require.resolve("../../../loaders/next-flight-css-dev-loader"),
                    ...(0, _loaders).getCssModuleLoader(ctx, lazyPostCSSInitializer), 
                ]
            }) : null,
            markRemovable({
                sideEffects: false,
                test: regexCssModules,
                use: (0, _loaders).getCssModuleLoader(ctx, lazyPostCSSInitializer)
            }), 
        ].filter(_nonNullable.nonNullable)
    }), // Opt-in support for Sass (using .scss or .sass extensions).
    // Sass Modules should never have side effects. This setting will
    // allow unused Sass to be removed from the production build.
    // We ensure this by disallowing `:global()` Sass at the top-level
    // via the `pure` mode in `css-loader`.
    (0, _helpers).loader({
        oneOf: [
            // For app dir, we match both server and client layers.
            ctx.hasAppDir && !ctx.isProduction ? markRemovable({
                sideEffects: false,
                test: regexSassModules,
                issuerLayer: {
                    or: [
                        _constants.WEBPACK_LAYERS.server,
                        _constants.WEBPACK_LAYERS.client
                    ]
                },
                use: [
                    require.resolve("../../../loaders/next-flight-css-dev-loader"),
                    ...(0, _loaders).getCssModuleLoader(ctx, lazyPostCSSInitializer, sassPreprocessors), 
                ]
            }) : null,
            ctx.hasAppDir && !ctx.isServer ? markRemovable({
                sideEffects: false,
                test: regexSassModules,
                use: [
                    require.resolve("../../../loaders/next-flight-css-dev-loader"),
                    ...(0, _loaders).getCssModuleLoader(ctx, lazyPostCSSInitializer, sassPreprocessors), 
                ]
            }) : null,
            markRemovable({
                sideEffects: false,
                test: regexSassModules,
                use: (0, _loaders).getCssModuleLoader(ctx, lazyPostCSSInitializer, sassPreprocessors)
            }), 
        ].filter(_nonNullable.nonNullable)
    }), // Throw an error for CSS Modules used outside their supported scope
    (0, _helpers).loader({
        oneOf: [
            markRemovable({
                test: [
                    regexCssModules,
                    regexSassModules
                ],
                use: {
                    loader: "error-loader",
                    options: {
                        reason: (0, _messages).getLocalModuleImportError()
                    }
                }
            }), 
        ]
    }));
    // Global CSS and SASS support.
    if (ctx.isServer) {
        fns.push((0, _helpers).loader({
            oneOf: [
                ctx.hasAppDir && !ctx.isProduction ? markRemovable({
                    sideEffects: true,
                    test: [
                        regexCssGlobal,
                        regexSassGlobal
                    ],
                    issuerLayer: {
                        or: [
                            _constants.WEBPACK_LAYERS.server,
                            _constants.WEBPACK_LAYERS.client
                        ]
                    },
                    use: require.resolve("../../../loaders/next-flight-css-dev-loader")
                }) : null,
                markRemovable({
                    // CSS imports have side effects, even on the server side.
                    sideEffects: true,
                    test: [
                        regexCssGlobal,
                        regexSassGlobal
                    ],
                    use: require.resolve("next/dist/compiled/ignore-loader")
                }), 
            ].filter(_nonNullable.nonNullable)
        }));
    } else {
        // They  are allowed to be loaded when any of the following is true:
        // - hasAppDir: If the issuerLayer is RSC
        // - If the CSS file is located in `node_modules`
        // - If the CSS file is located in another package in a monorepo (outside of the current rootDir)
        // - If the issuer is pages/_app (matched later)
        const allowedExternalCSSImports = {
            and: [
                {
                    or: [
                        /node_modules/,
                        {
                            not: [
                                ctx.rootDirectory
                            ]
                        }, 
                    ]
                }, 
            ]
        };
        fns.push((0, _helpers).loader({
            oneOf: [
                ctx.hasAppDir ? markRemovable({
                    sideEffects: true,
                    test: regexCssGlobal,
                    use: [
                        require.resolve("../../../loaders/next-flight-css-dev-loader"),
                        ...(0, _loaders).getGlobalCssLoader(ctx, lazyPostCSSInitializer), 
                    ]
                }) : null,
                ctx.hasAppDir ? markRemovable({
                    sideEffects: true,
                    test: regexSassGlobal,
                    use: [
                        require.resolve("../../../loaders/next-flight-css-dev-loader"),
                        ...(0, _loaders).getGlobalCssLoader(ctx, lazyPostCSSInitializer, sassPreprocessors), 
                    ]
                }) : null,
                !ctx.hasAppDir ? markRemovable({
                    sideEffects: true,
                    test: regexCssGlobal,
                    include: allowedExternalCSSImports,
                    issuer: shouldIncludeExternalCSSImports ? undefined : {
                        and: [
                            ctx.rootDirectory
                        ],
                        not: [
                            /node_modules/
                        ]
                    },
                    use: (0, _loaders).getGlobalCssLoader(ctx, lazyPostCSSInitializer)
                }) : null,
                !ctx.hasAppDir ? markRemovable({
                    sideEffects: true,
                    test: regexSassGlobal,
                    include: allowedExternalCSSImports,
                    issuer: shouldIncludeExternalCSSImports ? undefined : {
                        and: [
                            ctx.rootDirectory
                        ],
                        not: [
                            /node_modules/
                        ]
                    },
                    use: (0, _loaders).getGlobalCssLoader(ctx, lazyPostCSSInitializer, sassPreprocessors)
                }) : null, 
            ].filter(_nonNullable.nonNullable)
        }));
        if (ctx.customAppFile) {
            fns.push((0, _helpers).loader({
                oneOf: [
                    markRemovable({
                        sideEffects: true,
                        test: regexCssGlobal,
                        issuer: {
                            and: [
                                ctx.customAppFile
                            ]
                        },
                        use: (0, _loaders).getGlobalCssLoader(ctx, lazyPostCSSInitializer)
                    }), 
                ]
            }), (0, _helpers).loader({
                oneOf: [
                    markRemovable({
                        sideEffects: true,
                        test: regexSassGlobal,
                        issuer: {
                            and: [
                                ctx.customAppFile
                            ]
                        },
                        use: (0, _loaders).getGlobalCssLoader(ctx, lazyPostCSSInitializer, sassPreprocessors)
                    }), 
                ]
            }));
        }
    }
    // Throw an error for Global CSS used inside of `node_modules`
    if (!shouldIncludeExternalCSSImports) {
        fns.push((0, _helpers).loader({
            oneOf: [
                markRemovable({
                    test: [
                        regexCssGlobal,
                        regexSassGlobal
                    ],
                    issuer: {
                        and: [
                            /node_modules/
                        ]
                    },
                    use: {
                        loader: "error-loader",
                        options: {
                            reason: (0, _messages).getGlobalModuleImportError()
                        }
                    }
                }), 
            ]
        }));
    }
    // Throw an error for Global CSS used outside of our custom <App> file
    fns.push((0, _helpers).loader({
        oneOf: [
            markRemovable({
                test: [
                    regexCssGlobal,
                    regexSassGlobal
                ],
                issuer: ctx.hasAppDir ? {
                    // If it's inside the app dir, but not importing from a layout file,
                    // throw an error.
                    and: [
                        ctx.rootDirectory
                    ],
                    not: [
                        /layout\.(js|mjs|jsx|ts|tsx)$/
                    ]
                } : undefined,
                use: {
                    loader: "error-loader",
                    options: {
                        reason: (0, _messages).getGlobalImportError()
                    }
                }
            }), 
        ]
    }));
    if (ctx.isClient) {
        // Automatically transform references to files (i.e. url()) into URLs
        // e.g. url(./logo.svg)
        fns.push((0, _helpers).loader({
            oneOf: [
                markRemovable({
                    // This should only be applied to CSS files
                    issuer: regexLikeCss,
                    // Exclude extensions that webpack handles by default
                    exclude: [
                        /\.(js|mjs|jsx|ts|tsx)$/,
                        /\.html$/,
                        /\.json$/,
                        /\.webpack\[[^\]]+\]$/, 
                    ],
                    // `asset/resource` always emits a URL reference, where `asset`
                    // might inline the asset as a data URI
                    type: "asset/resource"
                }), 
            ]
        }));
    }
    // Enable full mini-css-extract-plugin hmr for prod mode pages or app dir
    if (ctx.isClient && (ctx.isProduction || ctx.hasAppDir)) {
        // Extract CSS as CSS file(s) in the client-side production bundle.
        const MiniCssExtractPlugin = require("../../../plugins/mini-css-extract-plugin").default;
        fns.push((0, _helpers).plugin(// @ts-ignore webpack 5 compat
        new MiniCssExtractPlugin({
            filename: ctx.isProduction ? "static/css/[contenthash].css" : "static/css/[name].css",
            chunkFilename: ctx.isProduction ? "static/css/[contenthash].css" : "static/css/[name].css",
            // Next.js guarantees that CSS order "doesn't matter", due to imposed
            // restrictions:
            // 1. Global CSS can only be defined in a single entrypoint (_app)
            // 2. CSS Modules generate scoped class names by default and cannot
            //    include Global CSS (:global() selector).
            //
            // While not a perfect guarantee (e.g. liberal use of `:global()`
            // selector), this assumption is required to code-split CSS.
            //
            // If this warning were to trigger, it'd be unactionable by the user,
            // but likely not valid -- so we disable it.
            ignoreOrder: true
        })));
    }
    const fn = (0, _utils).pipe(...fns);
    return fn(config);
});
exports.css = css;

//# sourceMappingURL=index.js.map