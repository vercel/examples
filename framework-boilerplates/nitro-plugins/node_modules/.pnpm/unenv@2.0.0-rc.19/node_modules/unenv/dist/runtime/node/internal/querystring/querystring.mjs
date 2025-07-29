// Source: https://github.com/nodejs/node/blob/v22.7.0/lib/internal/querystring.js
class ERR_INVALID_URI extends URIError {
	code = "ERR_INVALID_URI";
	constructor() {
		super("URI malformed");
	}
}
const hexTable = Array.from({ length: 256 });
for (let i = 0; i < 256; ++i) hexTable[i] = "%" + String.prototype.toUpperCase.call((i < 16 ? "0" : "") + Number.prototype.toString.call(i, 16));
// prettier-ignore
const isHexTable = new Int8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0
]);
/**
* @param {string} str
* @param {Int8Array} noEscapeTable
* @param {string[]} hexTable
* @returns {string}
*/
function encodeStr(str, noEscapeTable, hexTable) {
	const len = str.length;
	if (len === 0) return "";
	let out = "";
	let lastPos = 0;
	let i = 0;
	outer: for (; i < len; i++) {
		let c = String.prototype.charCodeAt.call(str, i);
		// ASCII
		while (c < 128) {
			if (noEscapeTable[c] !== 1) {
				if (lastPos < i) out += String.prototype.slice.call(str, lastPos, i);
				lastPos = i + 1;
				out += hexTable[c];
			}
			if (++i === len) break outer;
			c = String.prototype.charCodeAt.call(str, i);
		}
		if (lastPos < i) out += String.prototype.slice.call(str, lastPos, i);
		// Multi-byte characters ...
		if (c < 2048) {
			lastPos = i + 1;
			out += hexTable[192 | c >> 6] + hexTable[128 | c & 63];
			continue;
		}
		if (c < 55296 || c >= 57344) {
			lastPos = i + 1;
			out += hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
			continue;
		}
		// Surrogate pair
		++i;
		// This branch should never happen because all URLSearchParams entries
		// should already be converted to USVString. But, included for
		// completion's sake anyway.
		if (i >= len) throw new ERR_INVALID_URI();
		const c2 = String.prototype.charCodeAt.call(str, i) & 1023;
		lastPos = i + 1;
		c = 65536 + ((c & 1023) << 10 | c2);
		out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
	}
	if (lastPos === 0) return str;
	if (lastPos < len) return out + String.prototype.slice.call(str, lastPos);
	return out;
}
export { encodeStr, hexTable, isHexTable };
