declare const hexTable: string[];
// prettier-ignore
declare const isHexTable: unknown;
/**
* @param {string} str
* @param {Int8Array} noEscapeTable
* @param {string[]} hexTable
* @returns {string}
*/
declare function encodeStr(str: string, noEscapeTable: Int8Array, hexTable: string[]): string;
export { encodeStr, hexTable, isHexTable };
