/**
* A safe fast alternative to decodeURIComponent
* @param {string} s
* @param {boolean} decodeSpaces
* @returns {string}
*/
declare function unescapeBuffer(s: string, decodeSpaces?: boolean): string | Buffer;
/**
* @param {string} s
* @param {boolean} decodeSpaces
* @returns {string}
*/
declare function qsUnescape(s: string, decodeSpaces?: boolean): string;
/**
* QueryString.escape() replaces encodeURIComponent()
* @see https://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3.4
* @param {any} str
* @returns {string}
*/
declare function qsEscape(str: string): string;
/**
* @param {Record<string, string | number | boolean
* | ReadonlyArray<string | number | boolean> | null>} obj
* @param {string} [sep]
* @param {string} [eq]
* @param {{ encodeURIComponent?: (v: string) => string }} [options]
* @returns {string}
*/
declare function stringify(obj: Record<string, string | number | boolean | ReadonlyArray<string | number | boolean> | null>, sep: string, eq: string, options: {
	encodeURIComponent?: (v: string) => string;
});
/**
* Parse a key/val string.
* @param {string} qs
* @param {string} sep
* @param {string} eq
* @param {{
*   maxKeys?: number;
*   decodeURIComponent?(v: string): string;
*   }} [options]
* @returns {Record<string, string | string[]>}
*/
declare function parse(qs: string, sep: string, eq: string, options: {
	maxKeys?: number;
	decodeURIComponent?(v: string): string;
});
export { unescapeBuffer, qsUnescape as unescape, qsEscape as escape, stringify, stringify as encode, parse, parse as decode };
declare const _default: {};
export default _default;
