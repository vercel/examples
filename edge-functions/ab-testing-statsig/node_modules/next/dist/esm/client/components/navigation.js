// useLayoutSegments() // Only the segments for the current place. ['children', 'dashboard', 'children', 'integrations'] -> /dashboard/integrations (/dashboard/layout.js would get ['children', 'dashboard', 'children', 'integrations'])
import { useContext, useMemo } from 'react';
import { AppRouterContext, LayoutRouterContext } from '../../shared/lib/app-router-context';
import { SearchParamsContext, // ParamsContext,
PathnameContext } from '../../shared/lib/hooks-client-context';
import { bailoutToClientRendering } from './bailout-to-client-rendering';
const INTERNAL_URLSEARCHPARAMS_INSTANCE = Symbol('internal for urlsearchparams readonly');
function readonlyURLSearchParamsError() {
    return new Error('ReadonlyURLSearchParams cannot be modified');
}
class ReadonlyURLSearchParams {
    [Symbol.iterator]() {
        return this[INTERNAL_URLSEARCHPARAMS_INSTANCE][Symbol.iterator]();
    }
    append() {
        throw readonlyURLSearchParamsError();
    }
    delete() {
        throw readonlyURLSearchParamsError();
    }
    set() {
        throw readonlyURLSearchParamsError();
    }
    sort() {
        throw readonlyURLSearchParamsError();
    }
    constructor(urlSearchParams){
        // Since `new Headers` uses `this.append()` to fill the headers object ReadonlyHeaders can't extend from Headers directly as it would throw.
        this[INTERNAL_URLSEARCHPARAMS_INSTANCE] = urlSearchParams;
        this.entries = urlSearchParams.entries.bind(urlSearchParams);
        this.forEach = urlSearchParams.forEach.bind(urlSearchParams);
        this.get = urlSearchParams.get.bind(urlSearchParams);
        this.getAll = urlSearchParams.getAll.bind(urlSearchParams);
        this.has = urlSearchParams.has.bind(urlSearchParams);
        this.keys = urlSearchParams.keys.bind(urlSearchParams);
        this.values = urlSearchParams.values.bind(urlSearchParams);
        this.toString = urlSearchParams.toString.bind(urlSearchParams);
    }
}
/**
 * Get a read-only URLSearchParams object. For example searchParams.get('foo') would return 'bar' when ?foo=bar
 * Learn more about URLSearchParams here: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 */ export function useSearchParams() {
    const searchParams = useContext(SearchParamsContext);
    const readonlySearchParams = useMemo(()=>{
        return new ReadonlyURLSearchParams(searchParams || new URLSearchParams());
    }, [
        searchParams
    ]);
    if (bailoutToClientRendering()) {
        // TODO-APP: handle dynamic = 'force-static' here and on the client
        return readonlySearchParams;
    }
    if (!searchParams) {
        throw new Error('invariant expected search params to be mounted');
    }
    return readonlySearchParams;
}
/**
 * Get the current pathname. For example usePathname() on /dashboard?foo=bar would return "/dashboard"
 */ export function usePathname() {
    return useContext(PathnameContext);
}
// TODO-APP: getting all params when client-side navigating is non-trivial as it does not have route matchers so this might have to be a server context instead.
// export function useParams() {
//   return useContext(ParamsContext)
// }
// TODO-APP: define what should be provided through context.
// export function useLayoutSegments() {
//   return useContext(LayoutSegmentsContext)
// }
export { ServerInsertedHTMLContext, useServerInsertedHTML } from '../../shared/lib/server-inserted-html';
/**
 * Get the router methods. For example router.push('/dashboard')
 */ export function useRouter() {
    const router = useContext(AppRouterContext);
    if (router === null) {
        throw new Error('invariant expected app router to be mounted');
    }
    return router;
}
// TODO-APP: handle parallel routes
function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first = true, segmentPath = []) {
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        var _children;
        node = (_children = parallelRoutes.children) != null ? _children : Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    const segmentValue = Array.isArray(segment) ? segment[1] : segment;
    if (!segmentValue) return segmentPath;
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
// TODO-APP: Expand description when the docs are written for it.
/**
 * Get the canonical segment path from the current level to the leaf node.
 */ export function useSelectedLayoutSegments(parallelRouteKey = 'children') {
    const { tree  } = useContext(LayoutRouterContext);
    return getSelectedLayoutSegmentPath(tree, parallelRouteKey);
}
// TODO-APP: Expand description when the docs are written for it.
/**
 * Get the segment below the current level
 */ export function useSelectedLayoutSegment(parallelRouteKey = 'children') {
    const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
    if (selectedLayoutSegments.length === 0) {
        return null;
    }
    return selectedLayoutSegments[0];
}
export { redirect } from './redirect';
export { notFound } from './not-found';

//# sourceMappingURL=navigation.js.map