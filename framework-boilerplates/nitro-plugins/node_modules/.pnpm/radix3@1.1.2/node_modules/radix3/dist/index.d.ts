declare const NODE_TYPES: {
    NORMAL: 0;
    WILDCARD: 1;
    PLACEHOLDER: 2;
};
type _NODE_TYPES = typeof NODE_TYPES;
type NODE_TYPE = _NODE_TYPES[keyof _NODE_TYPES];
type _RadixNodeDataObject = {
    params?: never;
    [key: string]: any;
};
type RadixNodeData<T extends _RadixNodeDataObject = _RadixNodeDataObject> = T;
type MatchedRoute<T extends RadixNodeData = RadixNodeData> = Omit<T, "params"> & {
    params?: Record<string, any>;
};
interface RadixNode<T extends RadixNodeData = RadixNodeData> {
    type: NODE_TYPE;
    maxDepth: number;
    parent: RadixNode<T> | null;
    children: Map<string, RadixNode<T>>;
    data: RadixNodeData | null;
    paramName: string | null;
    wildcardChildNode: RadixNode<T> | null;
    placeholderChildren: RadixNode<T>[];
}
interface RadixRouterOptions {
    strictTrailingSlash?: boolean;
    routes?: Record<string, any>;
}
interface RadixRouterContext<T extends RadixNodeData = RadixNodeData> {
    options: RadixRouterOptions;
    rootNode: RadixNode<T>;
    staticRoutesMap: Record<string, RadixNode>;
}
interface RadixRouter<T extends RadixNodeData = RadixNodeData> {
    ctx: RadixRouterContext<T>;
    /**
     * Perform lookup of given path in radix tree
     * @param path - the path to search for
     *
     * @returns The data that was originally inserted into the tree
     */
    lookup(path: string): MatchedRoute<T> | null;
    /**
     * Perform an insert into the radix tree
     * @param path - the prefix to match
     * @param data - the associated data to path
     *
     */
    insert(path: string, data: T): void;
    /**
     * Perform a remove on the tree
     * @param { string } data.path - the route to match
     *
     * @returns A boolean signifying if the remove was successful or not
     */
    remove(path: string): boolean;
}
interface MatcherExport {
    dynamic: Map<string, MatcherExport>;
    wildcard: Map<string, {
        pattern: string;
    }>;
    static: Map<string, {
        pattern: string;
    }>;
}

declare function createRouter<T extends RadixNodeData = RadixNodeData>(options?: RadixRouterOptions): RadixRouter<T>;

interface RouteTable {
    static: Map<string, RadixNodeData | null>;
    wildcard: Map<string, RadixNodeData | null>;
    dynamic: Map<string, RouteTable>;
}
interface RouteMatcher {
    ctx: {
        table: RouteTable;
    };
    matchAll: (path: string) => RadixNodeData[];
}
declare function toRouteMatcher(router: RadixRouter): RouteMatcher;
declare function exportMatcher(matcher: RouteMatcher): MatcherExport;
declare function createMatcherFromExport(matcherExport: MatcherExport): RouteMatcher;

export { type MatchedRoute, type MatcherExport, type NODE_TYPE, NODE_TYPES, type RadixNode, type RadixNodeData, type RadixRouter, type RadixRouterContext, type RadixRouterOptions, type RouteMatcher, type RouteTable, createMatcherFromExport, createRouter, exportMatcher, toRouteMatcher };
