/**
* Converts a Punycode string of ASCII-only symbols to a string of Unicode
* symbols.
* @memberOf punycode
* @param {String} input The Punycode string of ASCII-only symbols.
* @returns {String} The resulting string of Unicode symbols.
*/
declare const decode: unknown;
/**
* Converts a string of Unicode symbols (e.g. a domain name label) to a
* Punycode string of ASCII-only symbols.
* @memberOf punycode
* @param {String} input The string of Unicode symbols.
* @returns {String} The resulting Punycode string of ASCII-only symbols.
*/
declare const encode: unknown;
/**
* Converts a Punycode string representing a domain name or an email address
* to Unicode. Only the Punycoded parts of the input will be converted, i.e.
* it doesn't matter if you call it on a string that has already been
* converted to Unicode.
* @memberOf punycode
* @param {String} input The Punycoded domain name or email address to
* convert to Unicode.
* @returns {String} The Unicode representation of the given Punycode
* string.
*/
declare const toUnicode: unknown;
/**
* Converts a Unicode string representing a domain name or an email address to
* Punycode. Only the non-ASCII parts of the domain name will be converted,
* i.e. it doesn't matter if you call it with a domain that's already in
* ASCII.
* @memberOf punycode
* @param {String} input The domain name or email address to convert, as a
* Unicode string.
* @returns {String} The Punycode representation of the given domain name or
* email address.
*/
declare const toASCII: unknown;
/*--------------------------------------------------------------------------*/
/**
* A string representing the current Punycode.js version number.
* @memberOf punycode
* @type String
*/
declare const version = "2.3.1";
/**
* An object of methods to convert from JavaScript's internal character
* representation (UCS-2) to Unicode code points, and back.
* @see <https://mathiasbynens.be/notes/javascript-encoding>
* @memberOf punycode
* @type Object
*/
declare const ucs2: {};
/** Define the public API */
declare const punycode: {};
export { version, ucs2, decode, encode, toASCII, toUnicode };
export default punycode;
