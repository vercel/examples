import _extends from "@swc/helpers/src/_extends.mjs";
import React, { lazy, Suspense } from 'react';
import Loadable from './loadable';
import NoSSR from './dynamic-no-ssr';
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    return {
        default: mod.default || mod
    };
}
export function noSSR(LoadableInitializer, loadableOptions) {
    // Removing webpack and modules means react-loadable won't try preloading
    delete loadableOptions.webpack;
    delete loadableOptions.modules;
    const NoSSRComponent = /*#__PURE__*/ lazy(LoadableInitializer);
    const Loading = loadableOptions.loading;
    const fallback = /*#__PURE__*/ React.createElement(Loading, {
        error: null,
        isLoading: true,
        pastDelay: false,
        timedOut: false
    });
    return (props)=>/*#__PURE__*/ React.createElement(Suspense, {
            fallback: fallback
        }, /*#__PURE__*/ React.createElement(NoSSR, null, /*#__PURE__*/ React.createElement(NoSSRComponent, Object.assign({}, props))));
}
export default function dynamic(dynamicOptions, options) {
    let loadableFn = Loadable;
    let loadableOptions = {
        // A loading component is not required, so we default it
        loading: ({ error , isLoading , pastDelay  })=>{
            if (!pastDelay) return null;
            if (process.env.NODE_ENV !== 'production') {
                if (isLoading) {
                    return null;
                }
                if (error) {
                    return /*#__PURE__*/ React.createElement("p", null, error.message, /*#__PURE__*/ React.createElement("br", null), error.stack);
                }
            }
            return null;
        }
    };
    // Support for direct import(), eg: dynamic(import('../hello-world'))
    // Note that this is only kept for the edge case where someone is passing in a promise as first argument
    // The react-loadable babel plugin will turn dynamic(import('../hello-world')) into dynamic(() => import('../hello-world'))
    // To make sure we don't execute the import without rendering first
    if (dynamicOptions instanceof Promise) {
        loadableOptions.loader = ()=>dynamicOptions;
    // Support for having import as a function, eg: dynamic(() => import('../hello-world'))
    } else if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    // Support for having first argument being options, eg: dynamic({loader: import('../hello-world')})
    } else if (typeof dynamicOptions === 'object') {
        loadableOptions = _extends({}, loadableOptions, dynamicOptions);
    }
    // Support for passing options, eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
    loadableOptions = _extends({}, loadableOptions, options);
    const loaderFn = loadableOptions.loader;
    const loader = ()=>loaderFn().then(convertModule);
    // coming from build/babel/plugins/react-loadable-plugin.js
    if (loadableOptions.loadableGenerated) {
        loadableOptions = _extends({}, loadableOptions, loadableOptions.loadableGenerated, {
            loader
        });
        delete loadableOptions.loadableGenerated;
    }
    // support for disabling server side rendering, eg: dynamic(() => import('../hello-world'), {ssr: false}).
    if (typeof loadableOptions.ssr === 'boolean') {
        if (!loadableOptions.ssr) {
            delete loadableOptions.ssr;
            return noSSR(loader, loadableOptions);
        }
        delete loadableOptions.ssr;
    }
    return loadableFn(loadableOptions);
};

//# sourceMappingURL=dynamic.js.map