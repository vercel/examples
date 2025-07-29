export type Options = {
	/**
	Overwrite existing destination file.

	@default true
	*/
	readonly overwrite?: boolean;

	/**
	[Permissions](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) for created directories.

	It has no effect on Windows.

	@default 0o777
	*/
	readonly directoryMode?: number;

	/**
	The working directory to find source files.

	The source and destination path are relative to this.

	@default process.cwd()
	*/
	readonly cwd?: string;
};

export type AsyncOptions = {
	/**
	The given function is called whenever there is measurable progress.

	Note: For empty files, the `onProgress` event is emitted only once.

	@example
	```
	import {copyFile} from 'copy-file';

	await copyFile('source/unicorn.png', 'destination/unicorn.png', {
		onProgress: progress => {
			// …
		}
	});
	```
	*/
	readonly onProgress?: (progress: ProgressData) => void;
};

export type ProgressData = {
	/**
	Absolute path to source.
	*/
	sourcePath: string;

	/**
	Absolute path to destination.
	*/
	destinationPath: string;

	/**
	File size in bytes.
	*/
	size: number;

	/**
	Copied size in bytes.
	*/
	writtenBytes: number;

	/**
	Copied percentage, a value between `0` and `1`.
	*/
	percent: number;
};

/**
Copy a file.

@param source - The file you want to copy.
@param destination - Where you want the file copied.
@returns A `Promise` that resolves when the file is copied.

The file is cloned if the `onProgress` option is not passed and the [file system supports it](https://stackoverflow.com/a/76496347/64949).

@example
```
import {copyFile} from 'copy-file';

await copyFile('source/unicorn.png', 'destination/unicorn.png');
console.log('File copied');
```
*/
export function copyFile(source: string, destination: string, options?: Options & AsyncOptions): Promise<void>;

/**
Copy a file synchronously.

@param source - The file you want to copy.
@param destination - Where you want the file copied.

The file is cloned if the [file system supports it](https://stackoverflow.com/a/76496347/64949).

@example
```
import {copyFileSync} from 'copy-file';

copyFileSync('source/unicorn.png', 'destination/unicorn.png');
```
*/
export function copyFileSync(source: string, destination: string, options?: Options): void;
