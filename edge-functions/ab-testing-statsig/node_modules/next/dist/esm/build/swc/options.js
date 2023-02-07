const nextDistPath = /(next[\\/]dist[\\/]shared[\\/]lib)|(next[\\/]dist[\\/]client)|(next[\\/]dist[\\/]pages)/;
const regeneratorRuntimePath = require.resolve("next/dist/compiled/regenerator-runtime");
export function getParserOptions({ filename , jsConfig , ...rest }) {
    var ref;
    const isTSFile = filename.endsWith(".ts");
    const isTypeScript = isTSFile || filename.endsWith(".tsx");
    const enableDecorators = Boolean(jsConfig == null ? void 0 : (ref = jsConfig.compilerOptions) == null ? void 0 : ref.experimentalDecorators);
    return {
        ...rest,
        syntax: isTypeScript ? "typescript" : "ecmascript",
        dynamicImport: true,
        decorators: enableDecorators,
        // Exclude regular TypeScript files from React transformation to prevent e.g. generic parameters and angle-bracket type assertion from being interpreted as JSX tags.
        [isTypeScript ? "tsx" : "jsx"]: !isTSFile,
        importAssertions: true
    };
}
function getBaseSWCOptions({ filename , jest , development , hasReactRefresh , globalWindow , nextConfig , resolvedBaseUrl , jsConfig , swcCacheDir , isServerLayer , hasServerComponents ,  }) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10;
    const parserConfig = getParserOptions({
        filename,
        jsConfig
    });
    const paths = jsConfig == null ? void 0 : (ref = jsConfig.compilerOptions) == null ? void 0 : ref.paths;
    const enableDecorators = Boolean(jsConfig == null ? void 0 : (ref1 = jsConfig.compilerOptions) == null ? void 0 : ref1.experimentalDecorators);
    const emitDecoratorMetadata = Boolean(jsConfig == null ? void 0 : (ref2 = jsConfig.compilerOptions) == null ? void 0 : ref2.emitDecoratorMetadata);
    const useDefineForClassFields = Boolean(jsConfig == null ? void 0 : (ref3 = jsConfig.compilerOptions) == null ? void 0 : ref3.useDefineForClassFields);
    const plugins = ((nextConfig == null ? void 0 : (ref4 = nextConfig.experimental) == null ? void 0 : ref4.swcPlugins) ?? []).filter(Array.isArray).map(([name, options])=>[
            require.resolve(name),
            options
        ]);
    return {
        jsc: {
            ...resolvedBaseUrl && paths ? {
                baseUrl: resolvedBaseUrl,
                paths
            } : {},
            externalHelpers: !process.versions.pnp && !jest,
            parser: parserConfig,
            experimental: {
                keepImportAssertions: true,
                plugins,
                cacheRoot: swcCacheDir
            },
            transform: {
                // Enables https://github.com/swc-project/swc/blob/0359deb4841be743d73db4536d4a22ac797d7f65/crates/swc_ecma_ext_transforms/src/jest.rs
                ...jest ? {
                    hidden: {
                        jest: true
                    }
                } : {},
                legacyDecorator: enableDecorators,
                decoratorMetadata: emitDecoratorMetadata,
                useDefineForClassFields: useDefineForClassFields,
                react: {
                    importSource: (jsConfig == null ? void 0 : (ref5 = jsConfig.compilerOptions) == null ? void 0 : ref5.jsxImportSource) ?? ((nextConfig == null ? void 0 : (ref6 = nextConfig.compiler) == null ? void 0 : ref6.emotion) ? "@emotion/react" : "react"),
                    runtime: "automatic",
                    pragma: "React.createElement",
                    pragmaFrag: "React.Fragment",
                    throwIfNamespace: true,
                    development: !!development,
                    useBuiltins: true,
                    refresh: !!hasReactRefresh
                },
                optimizer: {
                    simplify: false,
                    globals: jest ? null : {
                        typeofs: {
                            window: globalWindow ? "object" : "undefined"
                        },
                        envs: {
                            NODE_ENV: development ? '"development"' : '"production"'
                        }
                    }
                },
                regenerator: {
                    importPath: regeneratorRuntimePath
                }
            }
        },
        sourceMaps: jest ? "inline" : undefined,
        removeConsole: nextConfig == null ? void 0 : (ref7 = nextConfig.compiler) == null ? void 0 : ref7.removeConsole,
        // disable "reactRemoveProperties" when "jest" is true
        // otherwise the setting from next.config.js will be used
        reactRemoveProperties: jest ? false : nextConfig == null ? void 0 : (ref8 = nextConfig.compiler) == null ? void 0 : ref8.reactRemoveProperties,
        modularizeImports: nextConfig == null ? void 0 : (ref9 = nextConfig.experimental) == null ? void 0 : ref9.modularizeImports,
        relay: nextConfig == null ? void 0 : (ref10 = nextConfig.compiler) == null ? void 0 : ref10.relay,
        // Always transform styled-jsx and error when `client-only` condition is triggered
        styledJsx: true,
        // Disable css-in-js libs (without client-only integration) transform on server layer for server components
        ...!isServerLayer && {
            emotion: getEmotionOptions(nextConfig, development),
            styledComponents: getStyledComponentsOptions(nextConfig, development)
        },
        serverComponents: hasServerComponents ? {
            isServer: !!isServerLayer
        } : undefined
    };
}
function getStyledComponentsOptions(nextConfig, development) {
    var ref;
    let styledComponentsOptions = nextConfig == null ? void 0 : (ref = nextConfig.compiler) == null ? void 0 : ref.styledComponents;
    if (!styledComponentsOptions) {
        return null;
    }
    return {
        ...styledComponentsOptions,
        displayName: styledComponentsOptions.displayName ?? Boolean(development)
    };
}
function getEmotionOptions(nextConfig, development) {
    var ref, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18;
    if (!(nextConfig == null ? void 0 : (ref = nextConfig.compiler) == null ? void 0 : ref.emotion)) {
        return null;
    }
    let autoLabel = false;
    switch(nextConfig == null ? void 0 : (ref11 = nextConfig.compiler) == null ? void 0 : (ref12 = ref11.emotion) == null ? void 0 : ref12.autoLabel){
        case "never":
            autoLabel = false;
            break;
        case "always":
            autoLabel = true;
            break;
        case "dev-only":
        default:
            autoLabel = !!development;
            break;
    }
    return {
        enabled: true,
        autoLabel,
        importMap: nextConfig == null ? void 0 : (ref13 = nextConfig.compiler) == null ? void 0 : (ref14 = ref13.emotion) == null ? void 0 : ref14.importMap,
        labelFormat: nextConfig == null ? void 0 : (ref15 = nextConfig.compiler) == null ? void 0 : (ref16 = ref15.emotion) == null ? void 0 : ref16.labelFormat,
        sourcemap: development ? (nextConfig == null ? void 0 : (ref17 = nextConfig.compiler) == null ? void 0 : (ref18 = ref17.emotion) == null ? void 0 : ref18.sourceMap) ?? true : false
    };
}
export function getJestSWCOptions({ isServer , filename , esm , nextConfig , jsConfig , pagesDir , hasServerComponents ,  }) {
    let baseOptions = getBaseSWCOptions({
        filename,
        jest: true,
        development: false,
        hasReactRefresh: false,
        globalWindow: !isServer,
        nextConfig,
        jsConfig,
        hasServerComponents
    });
    const isNextDist = nextDistPath.test(filename);
    return {
        ...baseOptions,
        env: {
            targets: {
                // Targets the current version of Node.js
                node: process.versions.node
            }
        },
        module: {
            type: esm && !isNextDist ? "es6" : "commonjs"
        },
        disableNextSsg: true,
        disablePageConfig: true,
        pagesDir
    };
}
export function getLoaderSWCOptions({ filename , development , isServer , isServerLayer , pagesDir , isPageFile , hasReactRefresh , nextConfig , jsConfig , supportedBrowsers , swcCacheDir , relativeFilePathFromRoot , hasServerComponents ,  }) {
    var ref;
    let baseOptions = getBaseSWCOptions({
        filename,
        development,
        globalWindow: !isServer,
        hasReactRefresh,
        nextConfig,
        jsConfig,
        // resolvedBaseUrl,
        swcCacheDir,
        isServerLayer,
        relativeFilePathFromRoot,
        hasServerComponents
    });
    if ((nextConfig == null ? void 0 : (ref = nextConfig.experimental) == null ? void 0 : ref.fontLoaders) && relativeFilePathFromRoot) {
        baseOptions.fontLoaders = {
            fontLoaders: nextConfig.experimental.fontLoaders.map(({ loader  })=>loader),
            relativeFilePathFromRoot
        };
    }
    const isNextDist = nextDistPath.test(filename);
    if (isServer) {
        return {
            ...baseOptions,
            // Disables getStaticProps/getServerSideProps tree shaking on the server compilation for pages
            disableNextSsg: true,
            disablePageConfig: true,
            isDevelopment: development,
            isServer,
            pagesDir,
            isPageFile,
            env: {
                targets: {
                    // Targets the current version of Node.js
                    node: process.versions.node
                }
            }
        };
    } else {
        // Matches default @babel/preset-env behavior
        baseOptions.jsc.target = "es5";
        return {
            ...baseOptions,
            // Ensure Next.js internals are output as commonjs modules
            ...isNextDist ? {
                module: {
                    type: "commonjs"
                }
            } : {},
            disableNextSsg: !isPageFile,
            isDevelopment: development,
            isServer,
            pagesDir,
            isPageFile,
            ...supportedBrowsers && supportedBrowsers.length > 0 ? {
                env: {
                    targets: supportedBrowsers
                }
            } : {}
        };
    }
}

//# sourceMappingURL=options.js.map