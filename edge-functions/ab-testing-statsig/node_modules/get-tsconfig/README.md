# get-tsconfig [![Latest version](https://badgen.net/npm/v/get-tsconfig)](https://npm.im/get-tsconfig)

Find and parse `tsconfig.json` files.

### Features
- Zero dependency (not even TypeScript)
- Tested against TypeScript for correctness
- Supports comments & dangling commas in `tsconfig.json`
- Resolves [`extends`](https://www.typescriptlang.org/tsconfig/#extends)
- Fully typed `tsconfig.json`
- Validates and throws parsing errors
- Tiny! `3.6 kB` Minified + Gzipped

## 🚀 Install

```bash
npm install get-tsconfig
```

## 🙋‍♀️ Why?
For TypeScript related tooling to correctly parse `tsconfig.json` file without depending on TypeScript.

## ⚙️ API

### getTsconfig(searchPath?, configName?)
Searches for a `tsconfig.json` file and parses it. Returns `null` if a config file cannot be found, or an object containing the path and parsed TSConfig object if found.

Returns:

```ts
type TsconfigResult = {
    /**
     * The path to the tsconfig.json file
     */
    path: string

    /**
     * The resolved tsconfig.json file
     */
    config: TsConfigJsonResolved
}
```

#### searchPath
Type: `string`

Default: `process.cwd()`

Accepts a path to a file or directory to search up for a `tsconfig.json` file.

#### configName
Type: `string`

Default: `tsconfig.json`

The file name of the TypeScript config file.

#### Example

```ts
import { getTsconfig } from 'get-tsconfig'

// Searches for tsconfig.json starting in the current directory
console.log(getTsconfig())

// Find tsconfig.json from a TypeScript file path
console.log(getTsconfig('./path/to/index.ts'))

// Find tsconfig.json from a directory file path
console.log(getTsconfig('./path/to/directory'))

// Explicitly pass in tsconfig.json path
console.log(getTsconfig('./path/to/tsconfig.json'))
```

---

### parseTsconfig(tsconfigPath)
The `tsconfig.json` parser used internally by `getTsconfig`. Returns the parsed tsconfig as `TsConfigJsonResolved`.

#### tsconfigPath
Type: `string`

Required path to the tsconfig file.

#### Example

```ts
import { parseTsconfig } from 'get-tsconfig'

// Must pass in a path to an existing tsconfig.json file
console.log(parseTsconfig('./path/to/tsconfig.custom.json'))
```

---

### createPathsMatcher(tsconfig: TsconfigResult)

Given a tsconfig with [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) defined, it returns a matcher function.

The matcher function accepts an [import specifier (the path to resolve)](https://nodejs.org/api/esm.html#terminology), checks it against `compilerOptions.paths`, and returns an array of possible paths to check:
```ts
function pathsMatcher(specifier: string): string[]
```

This function only returns possible paths and doesn't actually do any resolution. This helps increase compatibility wtih file/build systems which usually have their own resolvers.

#### Example

```ts
import { getTsconfig, createPathsMatcher } from 'get-tsconfig'

const tsconfig = getTsconfig()
const pathsMatcher = createPathsMatcher(tsconfig)

function exampleResolver(request: string) {
    if (pathsMatcher) {
        const tryPaths = pathsMatcher(request)

        // Check if paths in `tryPaths` exist
    }
}
```

## FAQ

### How can I use TypeScript to parse `tsconfig.json`?
This package is a re-implementation of TypeScript's `tsconfig.json` parser.

However, if you already have TypeScript as a dependency, you can simply use it's API:

```ts
import {
    sys as tsSys,
    findConfigFile,
    readConfigFile,
    parseJsonConfigFileContent
} from 'typescript'

// Find tsconfig.json file
const tsconfigPath = findConfigFile(process.cwd(), tsSys.fileExists, 'tsconfig.json')

// Read tsconfig.json file
const tsconfigFile = readConfigFile(tsconfigPath, tsSys.readFile)

// Resolve extends
const parsedTsconfig = parseJsonConfigFileContent(
    tsconfigFile.config,
    tsSys,
    path.dirname(tsconfigPath)
)
```
