/**
Returns `true` if `filename` matches a junk file.

@example
```
import fs from 'node:fs/promises';
import {isJunk} from 'junk';

const files = await fs.readdir('some/path');

console.log(files);
//=> ['.DS_Store', 'test.jpg']

console.log(files.filter(isJunk));
//=> ['.DS_Store']
```
*/
export function isJunk(filename: string): boolean;

/**
Returns `true` if `filename` does not match a junk file.

@example
```
import fs from 'node:fs/promises';
import {isNotJunk} from 'junk';

const files = await fs.readdir('some/path');

console.log(files);
//=> ['.DS_Store', 'test.jpg']

console.log(files.filter(isNotJunk));
//=> ['test.jpg']
```
*/
export function isNotJunk(filename: string): boolean;

/**
Regex used for matching junk files.
*/
export const junkRegex: RegExp;
