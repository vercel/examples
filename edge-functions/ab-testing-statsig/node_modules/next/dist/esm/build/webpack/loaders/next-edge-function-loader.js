import { getModuleBuildInfo } from "./get-module-build-info";
import { stringifyRequest } from "../stringify-request";
export default function middlewareLoader() {
    const { absolutePagePath , page , rootDir  } = this.getOptions();
    const stringifiedPagePath = stringifyRequest(this, absolutePagePath);
    const buildInfo = getModuleBuildInfo(this._module);
    buildInfo.nextEdgeApiFunction = {
        page: page || "/"
    };
    buildInfo.rootDir = rootDir;
    return `
        import { adapter, enhanceGlobals } from 'next/dist/esm/server/web/adapter'

        enhanceGlobals()

        var mod = require(${stringifiedPagePath})
        var handler = mod.middleware || mod.default;

        if (typeof handler !== 'function') {
          throw new Error('The Edge Function "pages${page}" must export a \`default\` function');
        }

        export default function (opts) {
          return adapter({
              ...opts,
              page: ${JSON.stringify(page)},
              handler,
          })
        }
    `;
};

//# sourceMappingURL=next-edge-function-loader.js.map