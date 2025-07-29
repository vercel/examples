// Source: https://github.com/nodejs/node/blob/v22.7.0/lib/internal/url.js
import path from "node:path";
import * as punnycode from "../../punycode.mjs";
import { CHAR_FORWARD_SLASH, CHAR_BACKWARD_SLASH, CHAR_LOWERCASE_A, CHAR_LOWERCASE_Z } from "./constants.mjs";
import { ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_INVALID_URL_SCHEME, ERR_INVALID_FILE_URL_PATH, ERR_INVALID_FILE_URL_HOST } from "./errors.mjs";
// Protocols that can allow "unsafe" and "unwise" chars.
export const unsafeProtocol = new Set(["javascript", "javascript:"]);
// Protocols that never have a hostname.
export const hostlessProtocol = new Set(["javascript", "javascript:"]);
// Protocols that always contain a // bit.
export const slashedProtocol = new Set([
	"http",
	"http:",
	"https",
	"https:",
	"ftp",
	"ftp:",
	"gopher",
	"gopher:",
	"file",
	"file:",
	"ws",
	"ws:",
	"wss",
	"wss:"
]);
const FORWARD_SLASH = /\//g;
export function pathToFileURL(filepath, options) {
	const windows = options?.windows;
	if (windows && String.prototype.startsWith.call(filepath, "\\\\")) {
		const outURL = new URL("file://");
		// UNC path format: \\server\share\resource
		// Handle extended UNC path and standard UNC path
		// "\\?\UNC\" path prefix should be ignored.
		// Ref: https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation
		const isExtendedUNC = String.prototype.startsWith.call(filepath, "\\\\?\\UNC\\");
		const prefixLength = isExtendedUNC ? 8 : 2;
		const hostnameEndIndex = String.prototype.indexOf.call(filepath, "\\", prefixLength);
		if (hostnameEndIndex === -1) {
			throw new ERR_INVALID_ARG_VALUE("path", filepath, "Missing UNC resource path");
		}
		const hostname = String.prototype.slice.call(filepath, prefixLength, hostnameEndIndex);
		outURL.hostname = punnycode.toASCII(hostname);
		outURL.pathname = encodePathChars(filepath.slice(hostnameEndIndex).replace(backslashRegEx, "/"), { windows });
		return outURL;
	}
	let resolved = windows ? path.win32.resolve(filepath) : path.posix.resolve(filepath);
	// path.resolve strips trailing slashes so we must add them back
	const filePathLast = String.prototype.charCodeAt.call(filepath, filepath.length - 1);
	if ((filePathLast === CHAR_FORWARD_SLASH || windows && filePathLast === CHAR_BACKWARD_SLASH) && resolved.at(-1) !== path.sep) resolved += "/";
	// Call encodePathChars first to avoid encoding % again for ? and #.
	resolved = encodePathChars(resolved, { windows });
	// Question and hash character should be included in pathname.
	// Therefore, encoding is required to eliminate parsing them in different states.
	// This is done as an optimization to not creating a URL instance and
	// later triggering pathname setter, which impacts performance
	if (String.prototype.indexOf.call(resolved, "?") !== -1) resolved = resolved.replace(questionRegex, "%3F");
	if (String.prototype.indexOf.call(resolved, "#") !== -1) resolved = resolved.replace(hashRegex, "%23");
	return new URL(`file://${resolved}`);
}
export function fileURLToPath(path, options) {
	const windows = options?.windows;
	if (typeof path === "string") path = new URL(path);
	else if (!isURL(path)) throw new ERR_INVALID_ARG_TYPE("path", ["string", "URL"], path);
	if (path.protocol !== "file:") throw new ERR_INVALID_URL_SCHEME("file");
	return windows ? getPathFromURLWin32(path) : getPathFromURLPosix(path);
}
/**
* Utility function that converts a URL object into an ordinary options object
* as expected by the `http.request` and `https.request` APIs.
* @param {URL} url
* @returns {Record<string, unknown>}
*/
export function urlToHttpOptions(url) {
	const { hostname, pathname, port, username, password, search } = url;
	return {
		__proto__: null,
		...url,
		protocol: url.protocol,
		hostname: hostname && String.prototype.startsWith.call(hostname, "[") ? String.prototype.slice.call(hostname, 1, -1) : hostname,
		hash: url.hash,
		search,
		pathname,
		path: `${pathname || ""}${search || ""}`,
		href: url.href,
		port: port === "" ? undefined : Number(port),
		auth: username || password ? `${decodeURIComponent(username)}:${decodeURIComponent(password)}` : undefined
	};
}
// The following characters are percent-encoded when converting from file path
// to URL:
// - %: The percent character is the only character not encoded by the
//        `pathname` setter.
// - \: Backslash is encoded on non-windows platforms since it's a valid
//      character but the `pathname` setters replaces it by a forward slash.
// - LF: The newline character is stripped out by the `pathname` setter.
//       (See whatwg/url#419)
// - CR: The carriage return character is also stripped out by the `pathname`
//       setter.
// - TAB: The tab character is also stripped out by the `pathname` setter.
const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;
const questionRegex = /\?/g;
const hashRegex = /#/g;
function encodePathChars(filepath, options) {
	const windows = options?.windows;
	if (String.prototype.indexOf.call(filepath, "%") !== -1) filepath = filepath.replace(percentRegEx, "%25");
	// In posix, backslash is a valid character in paths:
	if (!windows && String.prototype.indexOf.call(filepath, "\\") !== -1) filepath = filepath.replace(backslashRegEx, "%5C");
	if (String.prototype.indexOf.call(filepath, "\n") !== -1) filepath = filepath.replace(newlineRegEx, "%0A");
	if (String.prototype.indexOf.call(filepath, "\r") !== -1) filepath = filepath.replace(carriageReturnRegEx, "%0D");
	if (String.prototype.indexOf.call(filepath, "	") !== -1) filepath = filepath.replace(tabRegEx, "%09");
	return filepath;
}
function getPathFromURLWin32(url) {
	const hostname = url.hostname;
	let pathname = url.pathname;
	for (let n = 0; n < pathname.length; n++) {
		if (pathname[n] === "%") {
			const third = pathname.codePointAt(n + 2) | 32;
			if (pathname[n + 1] === "2" && third === 102 || pathname[n + 1] === "5" && third === 99) {
				// 5c 5C \
				throw new ERR_INVALID_FILE_URL_PATH(String.raw`must not include encoded \ or / characters`);
			}
		}
	}
	pathname = pathname.replace(FORWARD_SLASH, "\\");
	pathname = decodeURIComponent(pathname);
	if (hostname !== "") {
		// If hostname is set, then we have a UNC path
		// Pass the hostname through domainToUnicode just in case
		// it is an IDN using punycode encoding. We do not need to worry
		// about percent encoding because the URL parser will have
		// already taken care of that for us. Note that this only
		// causes IDNs with an appropriate `xn--` prefix to be decoded.
		return `\\\\${punnycode.toUnicode(hostname)}${pathname}`;
	}
	// Otherwise, it's a local path that requires a drive letter
	const letter = String.prototype.codePointAt.call(pathname, 1) | 32;
	const sep = String.prototype.charAt.call(pathname, 2);
	if (letter < CHAR_LOWERCASE_A || letter > CHAR_LOWERCASE_Z || sep !== ":") {
		throw new ERR_INVALID_FILE_URL_PATH("must be absolute");
	}
	return String.prototype.slice.call(pathname, 1);
}
function getPathFromURLPosix(url) {
	if (url.hostname !== "") {
		throw new ERR_INVALID_FILE_URL_HOST("??");
	}
	const pathname = url.pathname;
	for (let n = 0; n < pathname.length; n++) {
		if (pathname[n] === "%") {
			const third = String.prototype.codePointAt.call(pathname, n + 2) | 32;
			if (pathname[n + 1] === "2" && third === 102) {
				throw new ERR_INVALID_FILE_URL_PATH("must not include encoded / characters");
			}
		}
	}
	return decodeURIComponent(pathname);
}
/**
* Checks if a value has the shape of a WHATWG URL object.
*
* Using a symbol or instanceof would not be able to recognize URL objects
* coming from other implementations (e.g. in Electron), so instead we are
* checking some well known properties for a lack of a better test.
*
* We use `href` and `protocol` as they are the only properties that are
* easy to retrieve and calculate due to the lazy nature of the getters.
*
* We check for `auth` and `path` attribute to distinguish legacy url instance with
* WHATWG URL instance.
* @param {*} self
* @returns {self is URL}
*/
function isURL(self) {
	return Boolean(self?.href && self.protocol && self.auth === undefined && self.path === undefined);
}
