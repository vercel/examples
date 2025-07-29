var path = require('path'); // if module is locally defined we path.resolve it
var callsite = require('callsite');

require.find = function (moduleName) {
  if (moduleName[0] === '.') {
    var stack = callsite();
    for (var i in stack) {
      var filename = stack[i].getFileName();
      if (filename !== module.filename) {
        moduleName = path.resolve(path.dirname(filename), moduleName);
        break;
      }
    }
  }
  try {
    return require.resolve(moduleName);
  } catch (e) {
    return;
  }
};

/**
 * Removes a module from the cache. We need this to re-load our http_request !
 * see: https://stackoverflow.com/a/14801711/1148249
 */
require.decache = function (moduleName) {

  moduleName = require.find(moduleName);

  if(!moduleName) { return; }

  // Run over the cache looking for the files
  // loaded by the specified module name
  require.searchCache(moduleName, function (mod) {
    delete require.cache[mod.id];
  });

  // Remove cached paths to the module.
  // Thanks to @bentael for pointing this out.
  Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
    if (cacheKey.indexOf(moduleName) > -1) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};

/**
 * Runs over the cache to search for all the cached
 * files
 */
require.searchCache = function (moduleName, callback) {
  // Resolve the module identified by the specified name
  var mod = require.resolve(moduleName);
  var visited = {};

  // Check if the module has been resolved and found within
  // the cache no else so #ignore else https://git.io/vtgMI
  /* istanbul ignore else */
  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    // Recursively go over the results
    (function run(current) {
      visited[current.id] = true;
      // Go over each of the module's children and
      // run over it
      current.children.forEach(function (child) {
        // ignore .node files, decachine native modules throws a
        // "module did not self-register" error on second require
        if (path.extname(child.filename) !== '.node' && !visited[child.id]) {
          run(child);
        }
      });

      // Call the specified callback providing the
      // found module
      callback(current);
    })(mod);
  }
};

module.exports = require.decache;
module.exports.default = require.decache;
