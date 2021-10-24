const ntm = require('next-transpile-modules')

/**
 * Wraps next-transpile-modules to include the
 * `@vercel/edge-functions-ui` module, which doesn't
 * come transpiled to npm.
 *
 * @type {typeof ntm}
 */
function transpileModules(modules = [], options = {}) {
  return ntm(['@vercel/edge-functions-ui'].concat(modules), {
    // Makes sure the package works when installed locally
    resolveSymlinks: false,
    ...options,
  })
}

module.exports = transpileModules
