/**
 * This is a TypeScript language service plugin for Next.js app directory,
 * it provides the following features:
 *
 * - Warns about disallowed React APIs in server components.
 * - Warns about disallowed layout and page exports.
 * - Autocompletion for entry configurations.
 * - Hover hint and docs for entry configurations.
 */
export declare function createTSPlugin(modules: {
    typescript: typeof import('typescript/lib/tsserverlibrary');
}): {
    create: (info: import("typescript/lib/tsserverlibrary").server.PluginCreateInfo) => any;
};
