# copy-file

> Copy a file

## Highlights

- It's super fast by [cloning](https://stackoverflow.com/questions/71629903/node-js-why-we-should-use-copyfile-ficlone-and-copyfile-ficlone-force-what-is) the file whenever possible.
- Resilient by using [graceful-fs](https://github.com/isaacs/node-graceful-fs).
- User-friendly by creating non-existent destination directories for you.
- Can be safe by turning off [overwriting](#overwrite).
- Preserves file mode [but not ownership](https://github.com/sindresorhus/copy-file/issues/22#issuecomment-502079547).
- User-friendly errors.

## Install

```sh
npm install copy-file
```

## Usage

```js
import {copyFile} from 'copy-file';

await copyFile('source/unicorn.png', 'destination/unicorn.png');
console.log('File copied');
```

## API

### copyFile(source, destination, options?)

Returns a `Promise` that resolves when the file is copied.

The file is cloned if the `onProgress` option is not passed and the [file system supports it](https://stackoverflow.com/a/76496347/64949).

### copyFileSync(source, destination, options?)

#### source

Type: `string`

The file you want to copy.

The file is cloned if the [file system supports it](https://stackoverflow.com/a/76496347/64949).

#### destination

Type: `string`

Where you want the file copied.

#### options

Type: `object`

##### overwrite

Type: `boolean`\
Default: `true`

Overwrite existing destination file.

##### cwd

Type: `string`\
Default: `process.cwd()`

The working directory to find source files.

The source and destination path are relative to this.

##### directoryMode

Type: `number`\
Default: `0o777`

[Permissions](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) for created directories.

It has no effect on Windows.

##### onProgress

Type: `(progress: ProgressData) => void`

The given function is called whenever there is measurable progress.

Only available when using the async method.

###### `ProgressData`

```js
{
	sourcePath: string,
	destinationPath: string,
	size: number,
	writtenBytes: number,
	percent: number
}
```

- `sourcePath` and `destinationPath` are absolute paths.
- `size` and `writtenBytes` are in bytes.
- `percent` is a value between `0` and `1`.

###### Notes

- For empty files, the `onProgress` callback function is emitted only once.

```js
import {copyFile} from 'copy-file';

await copyFile(source, destination, {
	onProgress: progress => {
		// …
	}
});
```

## Related

- [cpy](https://github.com/sindresorhus/cpy) - Copy files
- [cpy-cli](https://github.com/sindresorhus/cpy-cli) - Copy files on the command-line
- [move-file](https://github.com/sindresorhus/move-file) - Move a file
- [make-dir](https://github.com/sindresorhus/make-dir) - Make a directory and its parents if needed
