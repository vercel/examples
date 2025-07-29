import { notImplemented, notImplementedClass } from "../../../_internal/utils.mjs";
import { getRandomValues } from "./web.mjs";
// limit of Crypto.getRandomValues()
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
const MAX_RANDOM_VALUE_BYTES = 65536;
// ---- implemented Utils ----
export const webcrypto = new Proxy(globalThis.crypto, { get(_, key) {
	if (key === "CryptoKey") {
		return globalThis.CryptoKey;
	}
	if (typeof globalThis.crypto[key] === "function") {
		// @ts-ignore
		return globalThis.crypto[key].bind(globalThis.crypto);
	}
	return globalThis.crypto[key];
} });
export const randomBytes = (size, cb) => {
	const bytes = Buffer.alloc(size, 0, undefined);
	for (let generated = 0; generated < size; generated += MAX_RANDOM_VALUE_BYTES) {
		getRandomValues(
			// Use subarray to get a view of the buffer
			Uint8Array.prototype.subarray.call(bytes, generated, generated + MAX_RANDOM_VALUE_BYTES)
		);
	}
	if (typeof cb === "function") {
		cb(null, bytes);
		return undefined;
	}
	return bytes;
};
export const rng = randomBytes;
export const prng = randomBytes;
// ---- Constants ----
export const fips = false;
// ---- Unimplemented utils ----
export const checkPrime = /* @__PURE__ */ notImplemented("crypto.checkPrime");
export const checkPrimeSync = /* @__PURE__ */ notImplemented("crypto.checkPrimeSync");
/** @deprecated */
export const createCipher = /* @__PURE__ */ notImplemented("crypto.createCipher");
/** @deprecated */
export const createDecipher = /* @__PURE__ */ notImplemented("crypto.createDecipher");
export const pseudoRandomBytes = /* @__PURE__ */ notImplemented("crypto.pseudoRandomBytes");
export const createCipheriv = /* @__PURE__ */ notImplemented("crypto.createCipheriv");
export const createDecipheriv = /* @__PURE__ */ notImplemented("crypto.createDecipheriv");
export const createDiffieHellman = /* @__PURE__ */ notImplemented("crypto.createDiffieHellman");
export const createDiffieHellmanGroup = /* @__PURE__ */ notImplemented("crypto.createDiffieHellmanGroup");
export const createECDH = /* @__PURE__ */ notImplemented("crypto.createECDH");
export const createHash = /* @__PURE__ */ notImplemented("crypto.createHash");
export const createHmac = /* @__PURE__ */ notImplemented("crypto.createHmac");
export const createPrivateKey = /* @__PURE__ */ notImplemented("crypto.createPrivateKey");
export const createPublicKey = /* @__PURE__ */ notImplemented("crypto.createPublicKey");
export const createSecretKey = /* @__PURE__ */ notImplemented("crypto.createSecretKey");
export const createSign = /* @__PURE__ */ notImplemented("crypto.createSign");
export const createVerify = /* @__PURE__ */ notImplemented("crypto.createVerify");
export const diffieHellman = /* @__PURE__ */ notImplemented("crypto.diffieHellman");
export const generatePrime = /* @__PURE__ */ notImplemented("crypto.generatePrime");
export const generatePrimeSync = /* @__PURE__ */ notImplemented("crypto.generatePrimeSync");
export const getCiphers = /* @__PURE__ */ notImplemented("crypto.getCiphers");
export const getCipherInfo = /* @__PURE__ */ notImplemented("crypto.getCipherInfo");
export const getCurves = /* @__PURE__ */ notImplemented("crypto.getCurves");
export const getDiffieHellman = /* @__PURE__ */ notImplemented("crypto.getDiffieHellman");
export const getHashes = /* @__PURE__ */ notImplemented("crypto.getHashes");
export const hkdf = /* @__PURE__ */ notImplemented("crypto.hkdf");
export const hkdfSync = /* @__PURE__ */ notImplemented("crypto.hkdfSync");
export const pbkdf2 = /* @__PURE__ */ notImplemented("crypto.pbkdf2");
export const pbkdf2Sync = /* @__PURE__ */ notImplemented("crypto.pbkdf2Sync");
export const generateKeyPair = /* @__PURE__ */ notImplemented("crypto.generateKeyPair");
export const generateKeyPairSync = /* @__PURE__ */ notImplemented("crypto.generateKeyPairSync");
export const generateKey = /* @__PURE__ */ notImplemented("crypto.generateKey");
export const generateKeySync = /* @__PURE__ */ notImplemented("crypto.generateKeySync");
export const privateDecrypt = /* @__PURE__ */ notImplemented("crypto.privateDecrypt");
export const privateEncrypt = /* @__PURE__ */ notImplemented("crypto.privateEncrypt");
export const publicDecrypt = /* @__PURE__ */ notImplemented("crypto.publicDecrypt");
export const publicEncrypt = /* @__PURE__ */ notImplemented("crypto.publicEncrypt");
export const randomFill = /* @__PURE__ */ notImplemented("crypto.randomFill");
export const randomFillSync = /* @__PURE__ */ notImplemented("crypto.randomFillSync");
export const randomInt = /* @__PURE__ */ notImplemented("crypto.randomInt");
export const scrypt = /* @__PURE__ */ notImplemented("crypto.scrypt");
export const scryptSync = /* @__PURE__ */ notImplemented("crypto.scryptSync");
export const sign = /* @__PURE__ */ notImplemented("crypto.sign");
export const setEngine = /* @__PURE__ */ notImplemented("crypto.setEngine");
export const timingSafeEqual = /* @__PURE__ */ notImplemented("crypto.timingSafeEqual");
export const getFips = /* @__PURE__ */ notImplemented("crypto.getFips");
export const setFips = /* @__PURE__ */ notImplemented("crypto.setFips");
export const verify = /* @__PURE__ */ notImplemented("crypto.verify");
export const secureHeapUsed = /* @__PURE__ */ notImplemented("crypto.secureHeapUsed");
export const hash = /* @__PURE__ */ notImplemented("crypto.hash");
// ---- Unimplemented Classes ----
export const Certificate = /* @__PURE__ */ notImplementedClass("crypto.Certificate");
export const Cipher = /* @__PURE__ */ notImplementedClass("crypto.Cipher");
export const Cipheriv = /* @__PURE__ */ notImplementedClass(
	"crypto.Cipheriv"
	// @ts-expect-error not typed yet
);
export const Decipher = /* @__PURE__ */ notImplementedClass("crypto.Decipher");
export const Decipheriv = /* @__PURE__ */ notImplementedClass(
	"crypto.Decipheriv"
	// @ts-expect-error not typed yet
);
export const DiffieHellman = /* @__PURE__ */ notImplementedClass("crypto.DiffieHellman");
export const DiffieHellmanGroup = /* @__PURE__ */ notImplementedClass("crypto.DiffieHellmanGroup");
export const ECDH = /* @__PURE__ */ notImplementedClass("crypto.ECDH");
export const Hash = /* @__PURE__ */ notImplementedClass("crypto.Hash");
export const Hmac = /* @__PURE__ */ notImplementedClass("crypto.Hmac");
export const KeyObject = /* @__PURE__ */ notImplementedClass("crypto.KeyObject");
export const Sign = /* @__PURE__ */ notImplementedClass("crypto.Sign");
export const Verify = /* @__PURE__ */ notImplementedClass("crypto.Verify");
export const X509Certificate = /* @__PURE__ */ notImplementedClass("crypto.X509Certificate");
