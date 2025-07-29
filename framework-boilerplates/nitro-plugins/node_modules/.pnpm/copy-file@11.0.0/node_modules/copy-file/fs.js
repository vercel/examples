import {promisify} from 'node:util';
import fs from 'graceful-fs';
import {pEvent} from 'p-event';
import CopyFileError from './copy-file-error.js';

const statP = promisify(fs.stat);
const lstatP = promisify(fs.lstat);
const utimesP = promisify(fs.utimes);
const chmodP = promisify(fs.chmod);
const makeDirectoryP = promisify(fs.mkdir);

export const closeSync = fs.closeSync.bind(fs);
export const createWriteStream = fs.createWriteStream.bind(fs);

export async function createReadStream(path, options) {
	const read = fs.createReadStream(path, options);

	try {
		await pEvent(read, ['readable', 'end']);
	} catch (error) {
		throw new CopyFileError(`Cannot read from \`${path}\`: ${error.message}`, {cause: error});
	}

	return read;
}

export const stat = path => statP(path).catch(error => {
	throw new CopyFileError(`Cannot stat path \`${path}\`: ${error.message}`, {cause: error});
});

export const lstat = path => lstatP(path).catch(error => {
	throw new CopyFileError(`lstat \`${path}\` failed: ${error.message}`, {cause: error});
});

export const utimes = (path, atime, mtime) => utimesP(path, atime, mtime).catch(error => {
	throw new CopyFileError(`utimes \`${path}\` failed: ${error.message}`, {cause: error});
});

export const chmod = (path, mode) => chmodP(path, mode).catch(error => {
	throw new CopyFileError(`chmod \`${path}\` failed: ${error.message}`, {cause: error});
});

export const statSync = path => {
	try {
		return fs.statSync(path);
	} catch (error) {
		throw new CopyFileError(`stat \`${path}\` failed: ${error.message}`, {cause: error});
	}
};

export const lstatSync = path => {
	try {
		return fs.statSync(path);
	} catch (error) {
		throw new CopyFileError(`stat \`${path}\` failed: ${error.message}`, {cause: error});
	}
};

export const utimesSync = (path, atime, mtime) => {
	try {
		return fs.utimesSync(path, atime, mtime);
	} catch (error) {
		throw new CopyFileError(`utimes \`${path}\` failed: ${error.message}`, {cause: error});
	}
};

export const makeDirectory = (path, options) => makeDirectoryP(path, {...options, recursive: true}).catch(error => {
	throw new CopyFileError(`Cannot create directory \`${path}\`: ${error.message}`, {cause: error});
});

export const makeDirectorySync = (path, options) => {
	try {
		fs.mkdirSync(path, {...options, recursive: true});
	} catch (error) {
		throw new CopyFileError(`Cannot create directory \`${path}\`: ${error.message}`, {cause: error});
	}
};

export const copyFileSync = (source, destination, flags) => {
	try {
		fs.copyFileSync(source, destination, flags);
	} catch (error) {
		throw new CopyFileError(`Cannot copy from \`${source}\` to \`${destination}\`: ${error.message}`, {cause: error});
	}
};
