# ![zip-it-and-ship-it](zip-it-and-ship-it.png)

[![npm version](https://img.shields.io/npm/v/@netlify/zip-it-and-ship-it.svg)](https://npmjs.org/package/@netlify/zip-it-and-ship-it)
[![Coverage Status](https://codecov.io/gh/netlify/zip-it-and-ship-it/branch/main/graph/badge.svg)](https://codecov.io/gh/netlify/zip-it-and-ship-it)
[![Build](https://github.com/netlify/zip-it-and-ship-it/workflows/Build/badge.svg)](https://github.com/netlify/zip-it-and-ship-it/actions)
[![Downloads](https://img.shields.io/npm/dm/@netlify/zip-it-and-ship-it.svg)](https://www.npmjs.com/package/@netlify/zip-it-and-ship-it)

Creates Zip archives from Node.js, Go, and Rust programs. Those archives are ready to be uploaded to AWS Lambda.

This library is used under the hood by several Netlify features, including
[production CI builds](https://github.com/netlify/build), [Netlify CLI](https://github.com/netlify/cli) and the
[JavaScript client](https://github.com/netlify/js-client).

Check Netlify documentation for:

- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Bundling Functions in the CLI](https://www.netlify.com/docs/cli/#unbundled-javascript-function-deploys)

# Installation

```bash
npm install @netlify/zip-it-and-ship-it
```

# Usage (Node.js)

## zipFunctions(srcFolders, destFolder, options?)

- `srcFolders`: `string` | `Array<string>`
- `destFolder`: `string`
- `options`: `object?`
- _Return value_: `Promise<object[]>`

```js
import { zipFunctions } from '@netlify/zip-it-and-ship-it'

const archives = await zipFunctions('functions', 'functions-dist', {
  archiveFormat: 'zip',
})
```

Creates Zip `archives` from Node.js, Go, and Rust programs. Those `archives` are ready to be uploaded to AWS Lambda.

### `srcFolders`

A directory or a list of directories containing the source files. If a string is provided, the corresponding directory
must exist. If an array of strings is provided, at least one directory must exist.

In Netlify, this directory is the
["Functions folder"](https://docs.netlify.com/functions/optional-configuration/?fn-language=ts#directory).

A source folder can contain:

- Sub-directories with a main file called `index.js` or `{dir}.js` where `{dir}` is the sub-directory name.
- `.js`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts` or `.cts` files (Node.js)
- `.zip` archives with Node.js already ready to upload to AWS Lambda.
- Go programs already compiled. Those are copied as is.
- Rust programs already compiled. Those are zipped.

### `destFolder`

The directory where each `.zip` archive should be output. It is created if it does not exist. In Netlify CI, this is an
unspecified temporary directory inside the CI machine. In Netlify CLI, this is a `.netlify/functions` directory in your
build directory.

### `options`

An optional object for customizing the behavior of the archive creation process.

#### `archiveFormat`

- _Type_: `string`
- _Default value_: `zip`

Format of the archive created for each function. Defaults to ZIP archives.

If set to `none`, the output of each function will be a directory containing all the bundled files.

#### `basePath`

- _Type_: `string`
- _Default value_: `undefined`

The directory which all relative paths will be resolved from. These include paths in the `includedFiles` config
property, as well as imports using dynamic expressions such as `require(\`./files/${name}\`)`.

#### `config`

- _Type_: `object`
- _Default value_: `{}`

An object matching glob-like expressions to objects containing configuration properties. Whenever a function name
matches one of the expressions, it inherits the configuration properties.

The following properties are accepted:

- `externalNodeModules`

  - _Type_: `array<string>`

  List of Node modules to include separately inside a node_modules directory.

- `ignoredNodeModules`

  - _Type_: `array<string>`

  List of Node modules to keep out of the bundle.

- `nodeBundler`

  - _Type_: `string`
  - _Default value_: `zisi`

  The bundler to use when processing JavaScript functions. Possible values: `zisi`, `esbuild`, `esbuild_zisi` or `nft`.

  When the value is `esbuild_zisi`, `esbuild` will be used with a fallback to `zisi` in case of an error.

- `nodeSourcemap`

  - _Type_: `boolean`
  - _Default value_: `false`

  Whether to include a [sourcemap file](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)
  in the generated archive.

  Available only when `nodeBundler` is set to `esbuild` or `esbuild_zisi`.

- `nodeVersion`

  - _Type_: `string`\
  - _Default value_: `18`

  The version of Node.js to use as the compilation target for bundlers. This is also used to determine the runtime
  reported in the manifest. Any valid and supported Node.js version is accepted. Examples:

  - `14.x`
  - `16.1.0`
  - `v18`
  - `nodejs18.x` (for backwards compatibility)

- `rustTargetDirectory`

  - _Type_: `string`
  - _Default value_: Path to a temporary directory

  The path to use as the Cargo target directory when bundling Rust functions from source. When a value is not specified,
  a random temporary directory will be used.

  The `[name]` placeholder will be replaced by the name of the function, allowing you to use it to construct the path to
  the target directory.

- `name`

  - _Type_: `string`
  - _Default value_: undefined

  A name to use when displaying the function in the Netlify UI. Populates the `displayName` property in the functions
  manifest for the specified function.

- `generator`

  - _Type_: `string`
  - _Default value_: undefined

  A field to use if the function has been autogenerated by a plugin or integration. A recommended format is
  `@netlify/fake-plugin@1.0.0`, where adding the version is highly appreciated.

#### `featureFlags`

See [feature flags](#feature-flags).

#### `manifest`

- _Type_: `string`
- _Default value_: `undefined`

Defines the full path, including the file name, to use for the manifest file that will be created with the functions
bundling results. For example, `path/to/manifest.json`. This file is a JSON-formatted string with the following
properties:

- `functions`: An array with the functions created, in the same format as returned by `zipFunctions`
- `system.arch`: The operating system CPU architecture, as returned by
  [`process.arch`](https://nodejs.org/api/process.html#process_process_arch)
- `system.platform`: The operating system, as returned by
  [`process.platform`](https://nodejs.org/api/process.html#process_process_platform)
- `timestamp`: The timestamp (in milliseconds) at the time of the functions bundling process
- `version`: The version of the manifest file (current version is `1`)

#### `parallelLimit`

- _Type_: `number`
- _Default value_: `5`

Maximum number of functions to bundle at the same time.

#### `internalSrcFolder`

- _Type_: `string`
- _Default value_: `undefined`

Defines the path to the folder with internal functions. Used to populate a function's `generator` property if
`generator` is not configured in the function's config itself, if its path is within this specified internal functions
folder.

### Return value

This returns a `Promise` resolving to an array of objects describing each archive. Every object has the following
properties.

- `mainFile`: `string`

  The path to the function's entry file.

- `name`: `string`

  The name of the function.

- `path`: `string`

  Absolute file path to the archive file.

- `runtime` `string`

  Either `"js"`, `"go"`, or `"rs"`.

- `size`: `number`

  The size of the generated archive, in bytes.

- `displayName`: `string`

  If there was a user-defined configuration object applied to the function, and it had a `name` defined. This will be
  returned here.

- `generator`: `string`

  If there was a user-defined configuration object applied to the function, and it had `generator` defined. This will be
  returned here. If there was nothing defined, but an `internalSrcFolder` was passed and the function was defined in
  there, it will return a string to specify it was an internal function.

Additionally, the following properties also exist for Node.js functions:

- `bundler`: `string`

  Contains the name of the bundler that was used to prepare the function.

- `bundlerErrors`: `Array<object>`

  Contains any errors that were generated by the bundler when preparing the function.

- `bundlerWarnings`: `Array<object>`

  Contains any warnings that were generated by the bundler when preparing the function.

- `config`: `object`

  The user-defined configuration object that was applied to a particular function.

- `inputs`: `Array<string>`

  A list of file paths that were visited as part of the dependency traversal. For example, if `my-function.js` contains
  `require('./my-supporting-file.js')`, the `inputs` array will contain both `my-function.js` and
  `my-supporting-file.js`.

- `nativeNodeModules`: `object`

  A list of Node modules with native dependencies that were found during the module traversal. This is a two-level
  object, mapping module names to an object that maps the module path to its version. For example:

  ```json
  {
    "nativeNodeModules": {
      "module-one": {
        "/full/path/to/the/module": "1.0.0",
        "/another/instance/of/this/module": "2.0.0"
      }
    }
  }
  ```

- `runtimeAPIVersion` `number | undefined`

  When a function with the new API will be detected this is set to `2`. Otherwise it is set to `1`. `undefined` is only
  returned in case of an error.

- `runtimeVersion` `string | undefined`

  Which exact runtime this function should be using. (e.g. `nodejs18.x`). This value is detected based on the input
  `nodeVersion`.

## zipFunction(srcPath, destFolder, options?)

- `srcPath`: `string`
- `destFolder`: `string`
- `options`: `object?`
- _Return value_: `object | undefined`

```js
import { zipFunction } from '@netlify/zip-it-and-ship-it'

const archive = await zipFunction('functions/function.js', 'functions-dist')
```

This is like [`zipFunctions()`](#zipfunctionssrcfolders-destfolder-options) except it bundles a single Function.

The return value is `undefined` if the function is invalid.

## listFunctions(srcFolders, options?)

Returns the list of functions to bundle.

```js
import { listFunctions } from '@netlify/zip-it-and-ship-it'

const functions = await listFunctions('functions/function.js')
```

### `srcFolders`

A directory or a list of directories containing the source files. If a string is provided, the corresponding directory
must exist. If an array of strings is provided, at least one directory must exist.

### `options`

An optional options object.

#### `featureFlags`

See [feature flags](#feature-flags).

### Return value

Each object has the following properties:

- `name`: `string`

  Function's name. This is the one used in the Function URL. For example, if a Function is a `myFunc.js` regular file,
  the `name` is `myFunc` and the URL is `https://{hostname}/.netlify/functions/myFunc`.

- `displayName`: `string`

  If there was a user-defined configuration object applied to the function, and it had a `name` defined. This will be
  returned here.

- `mainFile`: `string`

  Absolute path to the Function's main file. If the Function is a Node.js directory, this is its `index.js` or
  `{dir}.js` file.

- `runtime`: `string`

  Either `"js"`, `"go"`, or `"rs"`.

- `extension`: `string`

  Source file extension. For Node.js, this is either `.js`, `.ts` or `.zip`. For Go, this can be anything.

- `generator`: `string`

  If there was a user-defined configuration object applied to the function, and it had `generator` defined. This will be
  returned here.

## listFunctionsFiles(srcFolders)

Like [`listFunctions()`](#listfunctionssrcfolders-options), except it returns not only the Functions main files, but
also all their required files. This is much slower.

```js
import { listFunctionsFiles } from '@netlify/zip-it-and-ship-it'

const functions = await listFunctionsFiles('functions/function.js')
```

### `srcFolders`

A directory or a list of directories containing the source files. If a string is provided, the corresponding directory
must exist. If an array of strings is provided, at least one directory must exist.

### `options`

An optional options object.

#### `featureFlags`

See [feature flags](#feature-flags).

### Return value

The return value is the same as [`listFunctions()`](#listfunctionssrcfolders-options) but with the following additional
properties.

- `srcFile`: `string`

  Absolute file to the source file.

# Usage (CLI)

```bash
$ zip-it-and-ship-it srcFolder destFolder
```

The CLI performs the same logic as [`zipFunctions()`](#zipfunctionssrcfolders-destfolder-options). The archives are
printed on `stdout` as a JSON array.

# Bundling Node.js functions

`zip-it-and-ship-it` uses two different mechanisms (bundlers) for preparing Node.js functions for deployment. You can
choose which one to use for all functions or on a per-function basis.

## zisi

This is the default bundler.

When using the `zisi` bundler, the following files are included in the generated archive:

- All files/directories within the same directory (except `node_modules`)
- All the files referenced using static `require()` calls
  - Example (user file): `require('./lib/my-file')`
  - Example (Node module): `require('date-fns')`

The following files are excluded:

- `@types/*` TypeScript definitions
- `aws-sdk` (on Node v16 and earlier)
- `@aws-sdk/*` (on Node v18 and later)
- Temporary files like `*~`, `*.swp`, etc.

## esbuild

The [`esbuild`](https://esbuild.github.io/) bundler can generate smaller archives due to its tree-shaking step. It's
also a lot faster. You can read more about it on
[the Netlify Blog](https://www.netlify.com/blog/2021/04/02/modern-faster-netlify-functions/).

When using esbuild, only the files that are directly required by a function or one of its dependencies will be included.
For example, a Node module has 1,000 files but your function only requires one of them, the other 999 will not be
included in the bundle.

You can enable esbuild by setting the [`config` option](#config) when calling `zipFunction` or `zipFunctions`:

```js
import { zipFunctions } from '@netlify/zip-it-and-ship-it'

const archives = await zipFunctions('functions', 'functions-dist', {
  config: {
    // Applying these settings to all functions.
    '*': {
      nodeBundler: 'esbuild',
    },
  },
})
```

# Feature flags

`zip-it-and-ship-it` uses feature flags to enable or disable features during their testing or deprecation periods.

These are supplied to each of the entrypoint functions (`zipFunction`, `zipFunctions`, `listFunctions` and
`listFunctionsFiles`) as a named parameter called `featureFlags`. It consists of an object where each key is the name of
a feature flag and the values are Booleans indicating whether each feature flag is enabled or disabled.

The list of all feature flags currently being used can be found [here](src/feature_flags.ts).

# Troubleshooting

## Build step

`zip-it-and-ship-it` does not build, transpile nor install the dependencies of the Functions. This needs to be done
before calling `zip-it-and-ship-it`.

## Missing dependencies

If a Node module `require()` another Node module but does not list it in its `package.json` (`dependencies`,
`peerDependencies` or `optionalDependencies`), it is not bundled, which might make the Function fail.

More information in [this issue](https://github.com/netlify/zip-it-and-ship-it/issues/68).

## Conditional require

Files required with a `require()` statement inside an `if` or `try`/`catch` block are always bundled.

More information in [this issue](https://github.com/netlify/zip-it-and-ship-it/issues/68).

## Dynamic require

Files required with a `require()` statement whose argument is not a string literal, e.g. `require(variable)`, are never
bundled.

More information in [this issue](https://github.com/netlify/zip-it-and-ship-it/issues/68).

## Node.js native modules

If your Function or one of its dependencies uses Node.js native modules, the Node.js version used in AWS Lambda might
need to be the same as the one used when installing those native modules.

In Netlify, this is done by ensuring that the following Node.js versions are the same:

- Build-time Node.js version: this defaults to Node `18`, but can be
  [overridden with a `.nvmrc` or `NODE_VERSION` environment variable](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript).
- Function runtime Node.js version: this defaults to `nodejs18.x` but can be
  [overridden with a `AWS_LAMBDA_JS_RUNTIME` environment variable](https://docs.netlify.com/functions/optional-configuration/?fn-language=js#node-js-version-for-runtime-2).

Note that this problem might not apply for Node.js native modules using the [N-API](https://nodejs.org/api/n-api.html).

More information in [this issue](https://github.com/netlify/zip-it-and-ship-it/issues/69).

## File Serving

As of `v0.3.0` the `serveFunctions` capability has been extracted out to
[Netlify Dev](https://github.com/netlify/netlify-dev-plugin/).
