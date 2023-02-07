"use client";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import React, { useEffect, useMemo, useCallback } from 'react';
import { createFromFetch } from 'next/dist/compiled/react-server-dom-webpack/client';
import { AppRouterContext, LayoutRouterContext, GlobalLayoutRouterContext, CacheStates } from '../../shared/lib/app-router-context';
import { ACTION_NAVIGATE, ACTION_PREFETCH, ACTION_REFRESH, ACTION_RESTORE, ACTION_SERVER_PATCH, createHrefFromUrl, reducer } from './reducer';
import { SearchParamsContext, // ParamsContext,
PathnameContext } from '../../shared/lib/hooks-client-context';
import { useReducerWithReduxDevtools } from './use-reducer-with-devtools';
import { ErrorBoundary, GlobalErrorComponent } from './error-boundary';
import { NEXT_ROUTER_PREFETCH, NEXT_ROUTER_STATE_TREE, RSC } from './app-router-headers';

function urlToUrlWithoutFlightMarker(url) {
    const urlWithoutFlightParameters = new URL(url, location.origin);
    // TODO-APP: handle .rsc for static export case
    return urlWithoutFlightParameters;
}
const HotReloader = process.env.NODE_ENV === 'production' ? null : require('./react-dev-overlay/hot-reloader-client').default;
/**
 * Fetch the flight data for the provided url. Takes in the current router state to decide what to render server-side.
 */ export function fetchServerResponse(url, flightRouterState, prefetch) {
    return _fetchServerResponse.apply(this, arguments);
}
function _fetchServerResponse() {
    _fetchServerResponse = _async_to_generator(function*(url, flightRouterState, prefetch) {
        const headers = {
            // Enable flight response
            [RSC]: '1',
            // Provide the current router state
            [NEXT_ROUTER_STATE_TREE]: JSON.stringify(flightRouterState)
        };
        if (prefetch) {
            // Enable prefetch response
            headers[NEXT_ROUTER_PREFETCH] = '1';
        }
        const res = yield fetch(url.toString(), {
            headers
        });
        const canonicalUrl = res.redirected ? urlToUrlWithoutFlightMarker(res.url) : undefined;
        const isFlightResponse = res.headers.get('content-type') === 'application/octet-stream';
        // If fetch returns something different than flight response handle it like a mpa navigation
        if (!isFlightResponse) {
            return [
                res.url,
                undefined
            ];
        }
        // Handle the `fetch` readable stream that can be unwrapped by `React.use`.
        const flightData = yield createFromFetch(Promise.resolve(res));
        return [
            flightData,
            canonicalUrl
        ];
    });
    return _fetchServerResponse.apply(this, arguments);
}
// Ensure the initialParallelRoutes are not combined because of double-rendering in the browser with Strict Mode.
let initialParallelRoutes = typeof window === 'undefined' ? null : new Map();
const prefetched = new Set();
function findHeadInCache(cache, parallelRoutes) {
    const isLastItem = Object.keys(parallelRoutes).length === 0;
    if (isLastItem) {
        return cache.head;
    }
    for(const key in parallelRoutes){
        const [segment, childParallelRoutes] = parallelRoutes[key];
        const childSegmentMap = cache.parallelRoutes.get(key);
        if (!childSegmentMap) {
            continue;
        }
        const cacheKey = Array.isArray(segment) ? segment[1] : segment;
        const cacheNode = childSegmentMap.get(cacheKey);
        if (!cacheNode) {
            continue;
        }
        const item = findHeadInCache(cacheNode, childParallelRoutes);
        if (item) {
            return item;
        }
    }
    return undefined;
}
/**
 * The global router that wraps the application components.
 */ function Router({ initialHead , initialTree , initialCanonicalUrl , children , assetPrefix  }) {
    const initialState = useMemo(()=>{
        return {
            tree: initialTree,
            cache: {
                status: CacheStates.READY,
                data: null,
                subTreeData: children,
                parallelRoutes: typeof window === 'undefined' ? new Map() : initialParallelRoutes
            },
            prefetchCache: new Map(),
            pushRef: {
                pendingPush: false,
                mpaNavigation: false
            },
            focusAndScrollRef: {
                apply: false
            },
            canonicalUrl: // location.href is read as the initial value for canonicalUrl in the browser
            // This is safe to do as canonicalUrl can't be rendered, it's only used to control the history updates in the useEffect further down in this file.
            typeof window !== 'undefined' ? createHrefFromUrl(window.location) : initialCanonicalUrl
        };
    }, [
        children,
        initialCanonicalUrl,
        initialTree
    ]);
    const [{ tree , cache , prefetchCache , pushRef , focusAndScrollRef , canonicalUrl  }, dispatch, sync, ] = useReducerWithReduxDevtools(reducer, initialState);
    const head = useMemo(()=>{
        return findHeadInCache(cache, tree[1]);
    }, [
        cache,
        tree
    ]);
    useEffect(()=>{
        // Ensure initialParallelRoutes is cleaned up from memory once it's used.
        initialParallelRoutes = null;
    }, []);
    // Add memoized pathname/query for useSearchParams and usePathname.
    const { searchParams , pathname  } = useMemo(()=>{
        const url = new URL(canonicalUrl, typeof window === 'undefined' ? 'http://n' : window.location.href);
        return {
            // This is turned into a readonly class in `useSearchParams`
            searchParams: url.searchParams,
            pathname: url.pathname
        };
    }, [
        canonicalUrl
    ]);
    /**
   * Server response that only patches the cache and tree.
   */ const changeByServerResponse = useCallback((previousTree, flightData, overrideCanonicalUrl)=>{
        dispatch({
            type: ACTION_SERVER_PATCH,
            flightData,
            previousTree,
            overrideCanonicalUrl,
            cache: {
                status: CacheStates.LAZY_INITIALIZED,
                data: null,
                subTreeData: null,
                parallelRoutes: new Map()
            },
            mutable: {}
        });
    }, [
        dispatch
    ]);
    /**
   * The app router that is exposed through `useRouter`. It's only concerned with dispatching actions to the reducer, does not hold state.
   */ const appRouter = useMemo(()=>{
        const navigate = (href, navigateType, forceOptimisticNavigation)=>{
            return dispatch({
                type: ACTION_NAVIGATE,
                url: new URL(href, location.origin),
                forceOptimisticNavigation,
                navigateType,
                cache: {
                    status: CacheStates.LAZY_INITIALIZED,
                    data: null,
                    subTreeData: null,
                    parallelRoutes: new Map()
                },
                mutable: {}
            });
        };
        const routerInstance = {
            back: ()=>window.history.back(),
            forward: ()=>window.history.forward(),
            prefetch: _async_to_generator(function*(href) {
                // If prefetch has already been triggered, don't trigger it again.
                if (prefetched.has(href)) {
                    return;
                }
                prefetched.add(href);
                const url = new URL(href, location.origin);
                try {
                    var ref;
                    const routerTree = ((ref = window.history.state) == null ? void 0 : ref.tree) || initialTree;
                    const serverResponse = yield fetchServerResponse(url, // initialTree is used when history.state.tree is missing because the history state is set in `useEffect` below, it being missing means this is the hydration case.
                    routerTree, true);
                    // @ts-ignore startTransition exists
                    React.startTransition(()=>{
                        dispatch({
                            type: ACTION_PREFETCH,
                            url,
                            tree: routerTree,
                            serverResponse
                        });
                    });
                } catch (err) {
                    console.error('PREFETCH ERROR', err);
                }
            }),
            replace: (href, options = {})=>{
                // @ts-ignore startTransition exists
                React.startTransition(()=>{
                    navigate(href, 'replace', Boolean(options.forceOptimisticNavigation));
                });
            },
            push: (href, options = {})=>{
                // @ts-ignore startTransition exists
                React.startTransition(()=>{
                    navigate(href, 'push', Boolean(options.forceOptimisticNavigation));
                });
            },
            refresh: ()=>{
                // @ts-ignore startTransition exists
                React.startTransition(()=>{
                    dispatch({
                        type: ACTION_REFRESH,
                        cache: {
                            status: CacheStates.LAZY_INITIALIZED,
                            data: null,
                            subTreeData: null,
                            parallelRoutes: new Map()
                        },
                        mutable: {}
                    });
                });
            }
        };
        return routerInstance;
    }, [
        dispatch,
        initialTree
    ]);
    useEffect(()=>{
        // When mpaNavigation flag is set do a hard navigation to the new url.
        if (pushRef.mpaNavigation) {
            window.location.href = canonicalUrl;
            return;
        }
        // Identifier is shortened intentionally.
        // __NA is used to identify if the history entry can be handled by the app-router.
        // __N is used to identify if the history entry can be handled by the old router.
        const historyState = {
            __NA: true,
            tree
        };
        if (pushRef.pendingPush && createHrefFromUrl(new URL(window.location.href)) !== canonicalUrl) {
            // This intentionally mutates React state, pushRef is overwritten to ensure additional push/replace calls do not trigger an additional history entry.
            pushRef.pendingPush = false;
            window.history.pushState(historyState, '', canonicalUrl);
        } else {
            window.history.replaceState(historyState, '', canonicalUrl);
        }
        sync();
    }, [
        tree,
        pushRef,
        canonicalUrl,
        sync
    ]);
    // Add `window.nd` for debugging purposes.
    // This is not meant for use in applications as concurrent rendering will affect the cache/tree/router.
    if (typeof window !== 'undefined') {
        // @ts-ignore this is for debugging
        window.nd = {
            router: appRouter,
            cache,
            prefetchCache,
            tree
        };
    }
    /**
   * Handle popstate event, this is used to handle back/forward in the browser.
   * By default dispatches ACTION_RESTORE, however if the history entry was not pushed/replaced by app-router it will reload the page.
   * That case can happen when the old router injected the history entry.
   */ const onPopState = useCallback(({ state  })=>{
        if (!state) {
            // TODO-APP: this case only happens when pushState/replaceState was called outside of Next.js. It should probably reload the page in this case.
            return;
        }
        // This case happens when the history entry was pushed by the `pages` router.
        if (!state.__NA) {
            window.location.reload();
            return;
        }
        // @ts-ignore useTransition exists
        // TODO-APP: Ideally the back button should not use startTransition as it should apply the updates synchronously
        // Without startTransition works if the cache is there for this path
        React.startTransition(()=>{
            dispatch({
                type: ACTION_RESTORE,
                url: new URL(window.location.href),
                tree: state.tree
            });
        });
    }, [
        dispatch
    ]);
    // Register popstate event to call onPopstate.
    useEffect(()=>{
        window.addEventListener('popstate', onPopState);
        return ()=>{
            window.removeEventListener('popstate', onPopState);
        };
    }, [
        onPopState
    ]);
    const content = /*#__PURE__*/ React.createElement(React.Fragment, null, head || initialHead, cache.subTreeData);
    return /*#__PURE__*/ React.createElement(PathnameContext.Provider, {
        value: pathname
    }, /*#__PURE__*/ React.createElement(SearchParamsContext.Provider, {
        value: searchParams
    }, /*#__PURE__*/ React.createElement(GlobalLayoutRouterContext.Provider, {
        value: {
            changeByServerResponse,
            tree,
            focusAndScrollRef
        }
    }, /*#__PURE__*/ React.createElement(AppRouterContext.Provider, {
        value: appRouter
    }, /*#__PURE__*/ React.createElement(LayoutRouterContext.Provider, {
        value: {
            childNodes: cache.parallelRoutes,
            tree: tree,
            // Root node always has `url`
            // Provided in AppTreeContext to ensure it can be overwritten in layout-router
            url: canonicalUrl
        }
    }, HotReloader ? /*#__PURE__*/ React.createElement(HotReloader, {
        assetPrefix: assetPrefix
    }, content) : content)))));
}
export default function AppRouter(props) {
    return /*#__PURE__*/ React.createElement(ErrorBoundary, {
        errorComponent: GlobalErrorComponent
    }, /*#__PURE__*/ React.createElement(Router, Object.assign({}, props)));
};

//# sourceMappingURL=app-router.js.map