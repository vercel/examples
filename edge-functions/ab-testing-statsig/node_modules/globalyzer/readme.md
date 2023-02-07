# globalyzer

>  Detect and extract the glob part of a string

Utility to detect if a string contains a glob and then split it in a glob and none-glob part.

## Install

```
npm install globalyzer --save
```

## Usage

```js
const globalyzer = require('globalyzer');

globalyzer('foo/bar/.git/');
// => { base: 'foo/bar/.git/', glob: '', isGlob: false }

globalyzer('foo/bar/**/baz');
// => { base: 'foo/bar', glob: '**/baz', isGlob: true }
```


## API

### globalyzer(glob, options)

Type: `function`<br>
Returns: `{ base, glob, isGlob }`

Returns an object with the (non-glob) base path and the actual pattern.

#### options.strict

Type: `Boolean`<br>
Default: `true`

Be strict about what's a glob and what's not


#### glob

Type: `String`

Glob string to analyze.


## Credit

This is a fork of [is-glob](https://github.com/micromatch/is-glob) and [glob-base](https://github.com/micromatch/glob-base)


## License

MIT © [Terkel Gjervig](https://terkel.com)
