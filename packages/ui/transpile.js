const path = require('path')
const ntm = require('next-transpile-modules')

/**
 * Wraps next-transpile-modules to include the
 * `@vercel/examples-ui` module, which doesn't
 * come transpiled to npm.
 *
 * @type {typeof ntm}
 */
function transpileModules(modules = [], options = {}) {
  const configFn = ntm(['@vercel/examples-ui'].concat(modules), {
    // Makes sure the package works when installed locally
    resolveSymlinks: false,
    ...options,
  })

  return (nextConfig = {}) =>
    configFn({
      ...nextConfig,
      webpack(config, options) {
        // This is a fix to force Next.js to use the react lib defined in the app's node_modules,
        // otherwise the component of this package will use the locally installed version, ending
        // up in errors like hooks not working.
        // https://github.com/vercel/next.js/issues/9022#issuecomment-610255555
        if (options.isServer) {
          config.externals = ['react', ...config.externals]
        }
        config.resolve.alias['react'] = path.resolve(
          process.cwd(),
          'node_modules',
          'react'
        )
        return nextConfig.webpack ? nextConfig.webpack(config) : config
      },
    })
}

module.exports = transpileModules
