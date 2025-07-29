import path from 'node:path';
import realFS, {constants as fsConstants} from 'node:fs';
import realFSPromises from 'node:fs/promises';
import {pEvent} from 'p-event';
import CopyFileError from './copy-file-error.js';
import * as fs from './fs.js';

const resolvePath = (cwd, sourcePath, destinationPath) => ({
	sourcePath: path.resolve(cwd, sourcePath),
	destinationPath: path.resolve(cwd, destinationPath),
});

const checkSourceIsFile = (stat, source) => {
	if (!stat.isFile()) {
		throw Object.assign(new CopyFileError(`EISDIR: illegal operation on a directory '${source}'`), {
			errno: -21,
			code: 'EISDIR',
			source,
		});
	}
};

export async function copyFile(sourcePath, destinationPath, options = {}) {
	if (!sourcePath || !destinationPath) {
		throw new CopyFileError('`source` and `destination` required');
	}

	if (options.cwd) {
		({sourcePath, destinationPath} = resolvePath(options.cwd, sourcePath, destinationPath));
	}

	options = {
		overwrite: true,
		...options,
	};

	const stats = await fs.lstat(sourcePath);
	const {size} = stats;
	checkSourceIsFile(stats, sourcePath);
	await fs.makeDirectory(path.dirname(destinationPath), {mode: options.directoryMode});

	if (typeof options.onProgress === 'function') {
		const readStream = await fs.createReadStream(sourcePath);
		const writeStream = fs.createWriteStream(destinationPath, {flags: options.overwrite ? 'w' : 'wx'});

		const emitProgress = writtenBytes => {
			options.onProgress({
				sourcePath: path.resolve(sourcePath),
				destinationPath: path.resolve(destinationPath),
				size,
				writtenBytes,
				percent: writtenBytes === size ? 1 : writtenBytes / size,
			});
		};

		readStream.on('data', () => {
			emitProgress(writeStream.bytesWritten);
		});

		let readError;

		readStream.once('error', error => {
			readError = new CopyFileError(`Cannot read from \`${sourcePath}\`: ${error.message}`, {cause: error});
		});

		let shouldUpdateStats = false;
		try {
			const writePromise = pEvent(writeStream, 'close');
			readStream.pipe(writeStream);
			await writePromise;
			emitProgress(size);
			shouldUpdateStats = true;
		} catch (error) {
			throw new CopyFileError(`Cannot write to \`${destinationPath}\`: ${error.message}`, {cause: error});
		}

		if (readError) {
			throw readError;
		}

		if (shouldUpdateStats) {
			const stats = await fs.lstat(sourcePath);

			return Promise.all([
				fs.utimes(destinationPath, stats.atime, stats.mtime),
				fs.chmod(destinationPath, stats.mode),
			]);
		}
	} else {
		// eslint-disable-next-line no-bitwise
		const flags = options.overwrite ? fsConstants.COPYFILE_FICLONE : (fsConstants.COPYFILE_FICLONE | fsConstants.COPYFILE_EXCL);

		try {
			await realFSPromises.copyFile(sourcePath, destinationPath, flags);

			await Promise.all([
				realFSPromises.utimes(destinationPath, stats.atime, stats.mtime),
				realFSPromises.chmod(destinationPath, stats.mode),
			]);
		} catch (error) {
			throw new CopyFileError(error.message, {cause: error});
		}
	}
}

export function copyFileSync(sourcePath, destinationPath, options = {}) {
	if (!sourcePath || !destinationPath) {
		throw new CopyFileError('`source` and `destination` required');
	}

	if (options.cwd) {
		({sourcePath, destinationPath} = resolvePath(options.cwd, sourcePath, destinationPath));
	}

	options = {
		overwrite: true,
		...options,
	};

	const stats = fs.lstatSync(sourcePath);
	checkSourceIsFile(stats, sourcePath);
	fs.makeDirectorySync(path.dirname(destinationPath), {mode: options.directoryMode});

	// eslint-disable-next-line no-bitwise
	const flags = options.overwrite ? fsConstants.COPYFILE_FICLONE : (fsConstants.COPYFILE_FICLONE | fsConstants.COPYFILE_EXCL);
	try {
		realFS.copyFileSync(sourcePath, destinationPath, flags);
	} catch (error) {
		throw new CopyFileError(error.message, {cause: error});
	}

	fs.utimesSync(destinationPath, stats.atime, stats.mtime);
	fs.chmod(destinationPath, stats.mode);
}
