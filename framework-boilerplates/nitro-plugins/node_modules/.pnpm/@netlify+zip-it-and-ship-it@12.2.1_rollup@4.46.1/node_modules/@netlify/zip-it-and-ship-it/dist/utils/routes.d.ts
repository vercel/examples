export type Route = {
    pattern: string;
} & ({
    literal: string;
} | {
    expression: string;
});
export type ExtendedRoute = Route & {
    methods?: string[];
    prefer_static?: boolean;
};
/**
 * Takes a `path` declaration, normalizes it into an array, and processes the
 * individual elements to obtain an array of `Route` expressions.
 */
export declare const getRoutes: (functionName: string, pathOrPaths: unknown) => ExtendedRoute[];
