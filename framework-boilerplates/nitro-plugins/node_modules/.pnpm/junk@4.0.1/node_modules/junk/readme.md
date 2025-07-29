# junk

> Filter out [system junk files](test.js) like `.DS_Store` and `Thumbs.db`

## Install

```
$ npm install junk
```

## Usage

```js
import fs from 'node:fs/promises';
import {isNotJunk} from 'junk';

const files = await fs.readdir('some/path');

console.log(files);
//=> ['.DS_Store', 'test.jpg']

console.log(files.filter(isNotJunk));
//=> ['test.jpg']
```

## API

### isJunk(filename)

Returns `true` if `filename` matches a junk file.

### isNotJunk(filename)

Returns `true` if `filename` does not match a junk file.

### junkRegex

Regex used for matching junk files.
