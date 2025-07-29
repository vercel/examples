import { access, appendFile, chmod, chown, copyFile, cp, glob, lchmod, lchown, link, lstat, lutimes, mkdir, mkdtemp, open, opendir, readFile, readdir, readlink, realpath, rename, rm, rmdir, stat, statfs, symlink, truncate, unlink, utimes, watch, writeFile } from "../internal/fs/promises.mjs";
import * as constants from "../internal/fs/constants.mjs";
export { constants };
export * from "../internal/fs/promises.mjs";
export default {
	constants,
	access,
	appendFile,
	chmod,
	chown,
	copyFile,
	cp,
	glob,
	lchmod,
	lchown,
	link,
	lstat,
	lutimes,
	mkdir,
	mkdtemp,
	open,
	opendir,
	readFile,
	readdir,
	readlink,
	realpath,
	rename,
	rm,
	rmdir,
	stat,
	statfs,
	symlink,
	truncate,
	unlink,
	utimes,
	watch,
	writeFile
};
