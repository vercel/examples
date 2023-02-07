import devalue from "next/dist/compiled/devalue";
import { join } from "path";
import { parse } from "querystring";
import { API_ROUTE } from "../../../../lib/constants";
import { isDynamicRoute } from "../../../../shared/lib/router/utils";
import { escapeStringRegexp } from "../../../../shared/lib/escape-regexp";
import { BUILD_MANIFEST, ROUTES_MANIFEST, REACT_LOADABLE_MANIFEST } from "../../../../shared/lib/constants";
import { stringifyRequest } from "../../stringify-request";
const nextServerlessLoader = function() {
    const { distDir , absolutePagePath , page , buildId , canonicalBase , assetPrefix , absoluteAppPath , absoluteDocumentPath , absoluteErrorPath , absolute404Path , generateEtags , poweredByHeader , basePath , runtimeConfig , previewProps , loadedEnvFiles , i18n ,  } = typeof this.query === "string" ? parse(this.query.slice(1)) : this.query;
    const buildManifest = join(distDir, BUILD_MANIFEST).replace(/\\/g, "/");
    const reactLoadableManifest = join(distDir, REACT_LOADABLE_MANIFEST).replace(/\\/g, "/");
    const routesManifest = join(distDir, ROUTES_MANIFEST).replace(/\\/g, "/");
    const escapedBuildId = escapeStringRegexp(buildId);
    const pageIsDynamicRoute = isDynamicRoute(page);
    const encodedPreviewProps = devalue(JSON.parse(previewProps));
    const envLoading = `
      const { processEnv } = require('@next/env')
      processEnv(${Buffer.from(loadedEnvFiles, "base64").toString()})
    `;
    const runtimeConfigImports = runtimeConfig ? `
        const { setConfig } = require('next/config')
      ` : "";
    const runtimeConfigSetter = runtimeConfig ? `
        const runtimeConfig = ${runtimeConfig}
        setConfig(runtimeConfig)
      ` : "const runtimeConfig = {}";
    if (page.match(API_ROUTE)) {
        return `
        ${envLoading}
        ${runtimeConfigImports}
        ${/*
            this needs to be called first so its available for any other imports
          */ runtimeConfigSetter}
        import 'next/dist/server/node-polyfill-fetch'
        import routesManifest from '${routesManifest}'

        import { getApiHandler } from 'next/dist/build/webpack/loaders/next-serverless-loader/api-handler'

        const rewrites = Array.isArray(routesManifest.rewrites)
          ? {
            afterFiles: routesManifest.rewrites
          }
          : routesManifest.rewrites

        const apiHandler = getApiHandler({
          pageModule: require(${stringifyRequest(this, absolutePagePath)}),
          rewrites: rewrites,
          i18n: ${i18n || "undefined"},
          page: "${page}",
          basePath: "${basePath}",
          pageIsDynamic: ${pageIsDynamicRoute},
          encodedPreviewProps: ${encodedPreviewProps}
        })
        export default apiHandler
      `;
    } else {
        return `
      import 'next/dist/server/node-polyfill-fetch'
      import routesManifest from '${routesManifest}'
      import buildManifest from '${buildManifest}'
      import reactLoadableManifest from '${reactLoadableManifest}'

      ${envLoading}
      ${runtimeConfigImports}
      ${// this needs to be called first so its available for any other imports
        runtimeConfigSetter}
      import { getPageHandler } from 'next/dist/build/webpack/loaders/next-serverless-loader/page-handler'

      const documentModule = require(${stringifyRequest(this, absoluteDocumentPath)})

      const appMod = require(${stringifyRequest(this, absoluteAppPath)})
      let App = appMod.default || appMod.then && appMod.then(mod => mod.default);

      const compMod = require(${stringifyRequest(this, absolutePagePath)})

      const Component = compMod.default || compMod.then && compMod.then(mod => mod.default)
      export default Component
      export const getStaticProps = compMod['getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['getStaticProp' + 's'])
      export const getStaticPaths = compMod['getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['getStaticPath' + 's'])
      export const getServerSideProps = compMod['getServerSideProp' + 's'] || compMod.then && compMod.then(mod => mod['getServerSideProp' + 's'])

      // kept for detecting legacy exports
      export const unstable_getStaticParams = compMod['unstable_getStaticParam' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticParam' + 's'])
      export const unstable_getStaticProps = compMod['unstable_getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticProp' + 's'])
      export const unstable_getStaticPaths = compMod['unstable_getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticPath' + 's'])
      export const unstable_getServerProps = compMod['unstable_getServerProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getServerProp' + 's'])

      export let config = compMod['confi' + 'g'] || (compMod.then && compMod.then(mod => mod['confi' + 'g'])) || {}
      export const _app = App

      const rewrites = Array.isArray(routesManifest.rewrites)
        ? {
          afterFiles: routesManifest.rewrites
        }
        : routesManifest.rewrites

      const { renderReqToHTML, render } = getPageHandler({
        pageModule: compMod,
        pageComponent: Component,
        pageConfig: config,
        appModule: App,
        documentModule: documentModule,
        errorModule: require(${stringifyRequest(this, absoluteErrorPath)}),
        notFoundModule: ${absolute404Path ? `require(${stringifyRequest(this, absolute404Path)})` : undefined},
        pageGetStaticProps: getStaticProps,
        pageGetStaticPaths: getStaticPaths,
        pageGetServerSideProps: getServerSideProps,

        assetPrefix: "${assetPrefix}",
        canonicalBase: "${canonicalBase}",
        generateEtags: ${generateEtags || "false"},
        poweredByHeader: ${poweredByHeader || "false"},

        runtimeConfig,
        buildManifest,
        reactLoadableManifest,

        rewrites: rewrites,
        i18n: ${i18n || "undefined"},
        page: "${page}",
        buildId: "${buildId}",
        escapedBuildId: "${escapedBuildId}",
        basePath: "${basePath}",
        pageIsDynamic: ${pageIsDynamicRoute},
        encodedPreviewProps: ${encodedPreviewProps}
      })
      export { renderReqToHTML, render }
    `;
    }
};
export default nextServerlessLoader;

//# sourceMappingURL=index.js.map