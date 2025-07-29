export const getNodeBuiltinPlugin = () => ({
    name: 'builtin-modules',
    setup(build) {
        build.onResolve({ filter: /^node:/ }, (args) => ({ path: args.path.slice('node:'.length), external: true }));
    },
});
