// src/utils.ts
var alphabetByEncoding = {};
var alphabetByValue = Array.from({ length: 64 });
for (let i = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  alphabetByEncoding[char] = i;
  alphabetByValue[i] = char;
}
for (let i = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  const index = i + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i = 0; i < 10; i++) {
  alphabetByEncoding[i.toString(10)] = i + 52;
  const char = i.toString(10);
  const index = i + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["-"] = 62;
alphabetByValue[62] = "-";
alphabetByEncoding["_"] = 63;
alphabetByValue[63] = "_";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;
var stringToBuffer = (value) => {
  return new TextEncoder().encode(value);
};
var bufferToString = (value) => {
  return new TextDecoder().decode(value);
};
var base64urlDecode = (_input) => {
  const input = _input + "=".repeat((4 - _input.length % 4) % 4);
  let totalByteLength = input.length / 4 * 3;
  if (input.endsWith("==")) {
    totalByteLength -= 2;
  } else if (input.endsWith("=")) {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i = 0; i < input.length; i += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j = i, limit = i + 3; j <= limit; j++) {
      if (input[j] === "=") {
        bits >>= bitsPerLetter;
      } else {
        if (!(input[j] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j]] << (limit - j) * bitsPerLetter;
        bitLength += bitsPerLetter;
      }
    }
    const chunkOffset = i / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k = 0; k < byteLength; k++) {
      const offset = (byteLength - k - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
};
var base64urlEncode = (_input) => {
  const input = typeof _input === "string" ? stringToBuffer(_input) : _input;
  let str = "";
  for (let i = 0; i < input.length; i += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j = i, limit = Math.min(i + 3, input.length); j < limit; j++) {
      bits |= input[j] << (limit - j - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k = 1; k <= bitClusterCount; k++) {
      const offset = (bitClusterCount - k) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
  }
  return str;
};

// src/index.ts
var defaults = {
  encryption: { saltBits: 256, algorithm: "aes-256-cbc", iterations: 1, minPasswordlength: 32 },
  integrity: { saltBits: 256, algorithm: "sha256", iterations: 1, minPasswordlength: 32 },
  ttl: 0,
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0
};
var clone = (options) => ({
  ...options,
  encryption: { ...options.encryption },
  integrity: { ...options.integrity }
});
var algorithms = {
  "aes-128-ctr": { keyBits: 128, ivBits: 128, name: "AES-CTR" },
  "aes-256-cbc": { keyBits: 256, ivBits: 128, name: "AES-CBC" },
  sha256: { keyBits: 256, name: "SHA-256" }
};
var macFormatVersion = "2";
var macPrefix = "Fe26.2";
var randomBytes = (_crypto, size) => {
  const bytes = new Uint8Array(size);
  _crypto.getRandomValues(bytes);
  return bytes;
};
var randomBits = (_crypto, bits) => {
  if (bits < 1)
    throw new Error("Invalid random bits count");
  const bytes = Math.ceil(bits / 8);
  return randomBytes(_crypto, bytes);
};
var pbkdf2 = async (_crypto, password, salt, iterations, keyLength, hash) => {
  const passwordBuffer = stringToBuffer(password);
  const importedKey = await _crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const saltBuffer = stringToBuffer(salt);
  const params = { name: "PBKDF2", hash, salt: saltBuffer, iterations };
  const derivation = await _crypto.subtle.deriveBits(params, importedKey, keyLength * 8);
  return derivation;
};
var generateKey = async (_crypto, password, options) => {
  var _a;
  if (!(password == null ? void 0 : password.length))
    throw new Error("Empty password");
  if (options == null || typeof options !== "object")
    throw new Error("Bad options");
  if (!(options.algorithm in algorithms))
    throw new Error(`Unknown algorithm: ${options.algorithm}`);
  const algorithm = algorithms[options.algorithm];
  const result = {};
  const hmac = (_a = options.hmac) != null ? _a : false;
  const id = hmac ? { name: "HMAC", hash: algorithm.name } : { name: algorithm.name };
  const usage = hmac ? ["sign", "verify"] : ["encrypt", "decrypt"];
  if (typeof password === "string") {
    if (password.length < options.minPasswordlength)
      throw new Error(
        `Password string too short (min ${options.minPasswordlength} characters required)`
      );
    let { salt = "" } = options;
    if (!salt) {
      const { saltBits = 0 } = options;
      if (!saltBits)
        throw new Error("Missing salt and saltBits options");
      const randomSalt = randomBits(_crypto, saltBits);
      salt = [...new Uint8Array(randomSalt)].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    const derivedKey = await pbkdf2(
      _crypto,
      password,
      salt,
      options.iterations,
      algorithm.keyBits / 8,
      "SHA-1"
    );
    const importedEncryptionKey = await _crypto.subtle.importKey(
      "raw",
      derivedKey,
      id,
      false,
      usage
    );
    result.key = importedEncryptionKey;
    result.salt = salt;
  } else {
    if (password.length < algorithm.keyBits / 8)
      throw new Error("Key buffer (password) too small");
    result.key = await _crypto.subtle.importKey("raw", password, id, false, usage);
    result.salt = "";
  }
  if (options.iv)
    result.iv = options.iv;
  else if ("ivBits" in algorithm)
    result.iv = randomBits(_crypto, algorithm.ivBits);
  return result;
};
var getEncryptParams = (algorithm, key, data) => {
  return [
    algorithm === "aes-128-ctr" ? { name: "AES-CTR", counter: key.iv, length: 128 } : { name: "AES-CBC", iv: key.iv },
    key.key,
    typeof data === "string" ? stringToBuffer(data) : data
  ];
};
var encrypt = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, options);
  const encrypted = await _crypto.subtle.encrypt(...getEncryptParams(options.algorithm, key, data));
  return { encrypted: new Uint8Array(encrypted), key };
};
var decrypt = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, options);
  const decrypted = await _crypto.subtle.decrypt(...getEncryptParams(options.algorithm, key, data));
  return bufferToString(new Uint8Array(decrypted));
};
var hmacWithPassword = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, { ...options, hmac: true });
  const textBuffer = stringToBuffer(data);
  const signed = await _crypto.subtle.sign({ name: "HMAC" }, key.key, textBuffer);
  const digest = base64urlEncode(new Uint8Array(signed));
  return { digest, salt: key.salt };
};
var normalizePassword = (password) => {
  if (typeof password === "string" || password instanceof Uint8Array)
    return { encryption: password, integrity: password };
  if ("secret" in password)
    return { id: password.id, encryption: password.secret, integrity: password.secret };
  return { id: password.id, encryption: password.encryption, integrity: password.integrity };
};
var seal = async (_crypto, object, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const objectString = JSON.stringify(object);
  const pass = normalizePassword(password);
  const { id = "", encryption, integrity } = pass;
  if (id && !/^\w+$/.test(id))
    throw new Error("Invalid password id");
  const { encrypted, key } = await encrypt(_crypto, encryption, opts.encryption, objectString);
  const encryptedB64 = base64urlEncode(new Uint8Array(encrypted));
  const iv = base64urlEncode(key.iv);
  const expiration = opts.ttl ? now + opts.ttl : "";
  const macBaseString = `${macPrefix}*${id}*${key.salt}*${iv}*${encryptedB64}*${expiration}`;
  const mac = await hmacWithPassword(_crypto, integrity, opts.integrity, macBaseString);
  const sealed = `${macBaseString}*${mac.salt}*${mac.digest}`;
  return sealed;
};
var fixedTimeComparison = (a, b) => {
  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch)
    b = a;
  for (let i = 0; i < a.length; i += 1)
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};
var unseal = async (_crypto, sealed, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const parts = sealed.split("*");
  if (parts.length !== 8)
    throw new Error("Incorrect number of sealed components");
  const prefix = parts[0];
  let passwordId = parts[1];
  const encryptionSalt = parts[2];
  const encryptionIv = parts[3];
  const encryptedB64 = parts[4];
  const expiration = parts[5];
  const hmacSalt = parts[6];
  const hmac = parts[7];
  const macBaseString = `${prefix}*${passwordId}*${encryptionSalt}*${encryptionIv}*${encryptedB64}*${expiration}`;
  if (macPrefix !== prefix)
    throw new Error("Wrong mac prefix");
  if (expiration) {
    if (!/^\d+$/.test(expiration))
      throw new Error("Invalid expiration");
    const exp = Number.parseInt(expiration, 10);
    if (exp <= now - opts.timestampSkewSec * 1e3)
      throw new Error("Expired seal");
  }
  let pass = "";
  passwordId = passwordId || "default";
  if (typeof password === "string" || password instanceof Uint8Array)
    pass = password;
  else if (passwordId in password) {
    pass = password[passwordId];
  } else {
    throw new Error(`Cannot find password: ${passwordId}`);
  }
  pass = normalizePassword(pass);
  const macOptions = opts.integrity;
  macOptions.salt = hmacSalt;
  const mac = await hmacWithPassword(_crypto, pass.integrity, macOptions, macBaseString);
  if (!fixedTimeComparison(mac.digest, hmac))
    throw new Error("Bad hmac value");
  const encrypted = base64urlDecode(encryptedB64);
  const decryptOptions = opts.encryption;
  decryptOptions.salt = encryptionSalt;
  decryptOptions.iv = base64urlDecode(encryptionIv);
  const decrypted = await decrypt(_crypto, pass.encryption, decryptOptions, encrypted);
  if (decrypted)
    return JSON.parse(decrypted);
  return null;
};

export { algorithms, base64urlDecode, base64urlEncode, bufferToString, clone, decrypt, defaults, encrypt, generateKey, hmacWithPassword, macFormatVersion, macPrefix, randomBits, seal, stringToBuffer, unseal };
