import WebServer from "../../../../server/web-server";
import { WebNextRequest, WebNextResponse } from "../../../../server/base-http/web";
import { SERVER_RUNTIME } from "../../../../lib/constants";
export function getRender({ dev , page , appMod , pageMod , errorMod , error500Mod , pagesType , Document , buildManifest , reactLoadableManifest , appRenderToHTML , pagesRenderToHTML , serverComponentManifest , subresourceIntegrityManifest , serverCSSManifest , config , buildId , fontLoaderManifest  }) {
    const isAppPath = pagesType === "app";
    const baseLoadComponentResult = {
        dev,
        buildManifest,
        reactLoadableManifest,
        subresourceIntegrityManifest,
        fontLoaderManifest,
        Document,
        App: appMod == null ? void 0 : appMod.default
    };
    const server = new WebServer({
        dev,
        conf: config,
        minimalMode: true,
        webServerConfig: {
            page,
            pagesType,
            extendRenderOpts: {
                buildId,
                runtime: SERVER_RUNTIME.edge,
                supportsDynamicHTML: true,
                disableOptimizedLoading: true,
                serverComponentManifest,
                serverCSSManifest
            },
            appRenderToHTML,
            pagesRenderToHTML,
            loadComponent: async (pathname)=>{
                if (isAppPath) return null;
                if (pathname === page) {
                    return {
                        ...baseLoadComponentResult,
                        Component: pageMod.default,
                        pageConfig: pageMod.config || {},
                        getStaticProps: pageMod.getStaticProps,
                        getServerSideProps: pageMod.getServerSideProps,
                        getStaticPaths: pageMod.getStaticPaths,
                        ComponentMod: pageMod,
                        pathname
                    };
                }
                // If there is a custom 500 page, we need to handle it separately.
                if (pathname === "/500" && error500Mod) {
                    return {
                        ...baseLoadComponentResult,
                        Component: error500Mod.default,
                        pageConfig: error500Mod.config || {},
                        getStaticProps: error500Mod.getStaticProps,
                        getServerSideProps: error500Mod.getServerSideProps,
                        getStaticPaths: error500Mod.getStaticPaths,
                        ComponentMod: error500Mod,
                        pathname
                    };
                }
                if (pathname === "/_error") {
                    return {
                        ...baseLoadComponentResult,
                        Component: errorMod.default,
                        pageConfig: errorMod.config || {},
                        getStaticProps: errorMod.getStaticProps,
                        getServerSideProps: errorMod.getServerSideProps,
                        getStaticPaths: errorMod.getStaticPaths,
                        ComponentMod: errorMod,
                        pathname
                    };
                }
                return null;
            }
        }
    });
    const requestHandler = server.getRequestHandler();
    return async function render(request) {
        const extendedReq = new WebNextRequest(request);
        const extendedRes = new WebNextResponse();
        requestHandler(extendedReq, extendedRes);
        return await extendedRes.toResponse();
    };
}

//# sourceMappingURL=render.js.map