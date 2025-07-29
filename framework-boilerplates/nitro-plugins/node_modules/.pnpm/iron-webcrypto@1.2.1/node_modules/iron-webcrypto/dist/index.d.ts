interface _Crypto {
    readonly subtle: _SubtleCrypto;
    getRandomValues: (array: Uint8Array) => Uint8Array;
}
interface _SubtleCrypto {
    decrypt: (algorithm: AesCbcParams | AesCtrParams | AesGcmParams | AlgorithmIdentifier | RsaOaepParams, key: CryptoKey, data: Uint8Array) => Promise<ArrayBuffer>;
    deriveBits: (algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params, baseKey: CryptoKey, length: number) => Promise<ArrayBuffer>;
    encrypt: (algorithm: AesCbcParams | AesCtrParams | AesGcmParams | AlgorithmIdentifier | RsaOaepParams, key: CryptoKey, data: Uint8Array) => Promise<ArrayBuffer>;
    importKey: (format: Exclude<KeyFormat, 'jwk'>, keyData: ArrayBuffer | Uint8Array, algorithm: AesKeyAlgorithm | AlgorithmIdentifier | EcKeyImportParams | HmacImportParams | RsaHashedImportParams, extractable: boolean, keyUsages: KeyUsage[]) => Promise<CryptoKey>;
    sign: (algorithm: AlgorithmIdentifier | EcdsaParams | RsaPssParams, key: CryptoKey, data: Uint8Array) => Promise<ArrayBuffer>;
}

/**
 * Algorithm used for encryption and decryption.
 */
type EncryptionAlgorithm = 'aes-128-ctr' | 'aes-256-cbc';
/**
 * Algorithm used for integrity verification.
 */
type IntegrityAlgorithm = 'sha256';
/**
 * @internal
 */
type _Algorithm = EncryptionAlgorithm | IntegrityAlgorithm;
/**
 * seal() method options.
 */
interface SealOptionsSub<Algorithm extends _Algorithm = _Algorithm> {
    /**
     * The length of the salt (random buffer used to ensure that two identical objects will generate a different encrypted result). Defaults to 256.
     */
    saltBits: number;
    /**
     * The algorithm used. Defaults to 'aes-256-cbc' for encryption and 'sha256' for integrity.
     */
    algorithm: Algorithm;
    /**
     * The number of iterations used to derive a key from the password. Defaults to 1.
     */
    iterations: number;
    /**
     * Minimum password size. Defaults to 32.
     */
    minPasswordlength: number;
}
/**
 * Options for customizing the key derivation algorithm used to generate encryption and integrity verification keys as well as the algorithms and salt sizes used.
 */
interface SealOptions {
    /**
     * Encryption step options.
     */
    encryption: SealOptionsSub<EncryptionAlgorithm>;
    /**
     * Integrity step options.
     */
    integrity: SealOptionsSub<IntegrityAlgorithm>;
    /**
     * Sealed object lifetime in milliseconds where 0 means forever. Defaults to 0.
     */
    ttl: number;
    /**
     * Number of seconds of permitted clock skew for incoming expirations. Defaults to 60 seconds.
     */
    timestampSkewSec: number;
    /**
     * Local clock time offset, expressed in number of milliseconds (positive or negative). Defaults to 0.
     */
    localtimeOffsetMsec: number;
}
/**
 * Password secret string or buffer.
 */
type Password = Uint8Array | string;
/**
 * generateKey() method options.
 */
type GenerateKeyOptions<Algorithm extends _Algorithm = _Algorithm> = Pick<SealOptionsSub<Algorithm>, 'algorithm' | 'iterations' | 'minPasswordlength'> & {
    saltBits?: number | undefined;
    salt?: string | undefined;
    iv?: Uint8Array | undefined;
    hmac?: boolean | undefined;
};
/**
 * Generated internal key object.
 */
interface Key {
    key: CryptoKey;
    salt: string;
    iv: Uint8Array;
}
/**
 * Generated HMAC internal results.
 */
interface HMacResult {
    digest: string;
    salt: string;
}
declare namespace password {
    /**
     * Secret object with optional id.
     */
    interface Secret {
        id?: string | undefined;
        secret: Password;
    }
    /**
     * Secret object with optional id and specified password for each encryption and integrity.
     */
    interface Specific {
        id?: string | undefined;
        encryption: Password;
        integrity: Password;
    }
    /**
     * Key-value pairs hash of password id to value.
     */
    type Hash = Record<string, Password | Secret | Specific>;
}
/**
 * @internal
 */
type RawPassword = Password | password.Secret | password.Specific;

/**
 * Convert a string to a Uint8Array.
 * @param value The string to convert
 * @returns The Uint8Array
 */
declare const stringToBuffer: (value: string) => Uint8Array;
/**
 * Convert a Uint8Array to a string.
 * @param value The Uint8Array to convert
 * @returns The string
 */
declare const bufferToString: (value: Uint8Array) => string;
/**
 * Decode a base64url string to a Uint8Array.
 * @param _input The base64url string to decode (automatically padded as necessary)
 * @returns The Uint8Array
 *
 * @see https://tools.ietf.org/html/rfc4648#section-5
 */
declare const base64urlDecode: (_input: string) => Uint8Array;
/**
 * Encode a Uint8Array to a base64url string.
 * @param _input The Uint8Array to encode
 * @returns The base64url string (without padding)
 *
 * @see https://tools.ietf.org/html/rfc4648#section-5
 */
declare const base64urlEncode: (_input: Uint8Array | string) => string;

/**
 * The default encryption and integrity settings.
 */
declare const defaults: SealOptions;
/**
 * Clones the options object.
 * @param options The options object to clone
 * @returns A new options object
 */
declare const clone: (options: SealOptions) => SealOptions;
/**
 * Configuration of each supported algorithm.
 */
declare const algorithms: {
    readonly 'aes-128-ctr': {
        readonly keyBits: 128;
        readonly ivBits: 128;
        readonly name: "AES-CTR";
    };
    readonly 'aes-256-cbc': {
        readonly keyBits: 256;
        readonly ivBits: 128;
        readonly name: "AES-CBC";
    };
    readonly sha256: {
        readonly keyBits: 256;
        readonly name: "SHA-256";
    };
};
/**
 * MAC normalization format version.
 */
declare const macFormatVersion = "2";
/**
 * MAC normalization prefix.
 */
declare const macPrefix = "Fe26.2";
/**
 * Generate cryptographically strong pseudorandom bits.
 * @param _crypto Custom WebCrypto implementation
 * @param bits Number of bits to generate
 * @returns Buffer
 */
declare const randomBits: (_crypto: _Crypto, bits: number) => Uint8Array;
/**
 * Generates a key from the password.
 * @param _crypto Custom WebCrypto implementation
 * @param password A password string or buffer key
 * @param options Object used to customize the key derivation algorithm
 * @returns An object with keys: key, salt, iv
 */
declare const generateKey: (_crypto: _Crypto, password: Password, options: GenerateKeyOptions) => Promise<Key>;
/**
 * Encrypts data.
 * @param _crypto Custom WebCrypto implementation
 * @param password A password string or buffer key
 * @param options Object used to customize the key derivation algorithm
 * @param data String to encrypt
 * @returns An object with keys: encrypted, key
 */
declare const encrypt: (_crypto: _Crypto, password: Password, options: GenerateKeyOptions<EncryptionAlgorithm>, data: string) => Promise<{
    encrypted: Uint8Array;
    key: Key;
}>;
/**
 * Decrypts data.
 * @param _crypto Custom WebCrypto implementation
 * @param password A password string or buffer key
 * @param options Object used to customize the key derivation algorithm
 * @param data Buffer to decrypt
 * @returns Decrypted string
 */
declare const decrypt: (_crypto: _Crypto, password: Password, options: GenerateKeyOptions<EncryptionAlgorithm>, data: Uint8Array | string) => Promise<string>;
/**
 * Calculates a HMAC digest.
 * @param _crypto Custom WebCrypto implementation
 * @param password A password string or buffer
 * @param options Object used to customize the key derivation algorithm
 * @param data String to calculate the HMAC over
 * @returns An object with keys: digest, salt
 */
declare const hmacWithPassword: (_crypto: _Crypto, password: Password, options: GenerateKeyOptions<IntegrityAlgorithm>, data: string) => Promise<HMacResult>;
/**
 * Serializes, encrypts, and signs objects into an iron protocol string.
 * @param _crypto Custom WebCrypto implementation
 * @param object Data being sealed
 * @param password A string, buffer or object
 * @param options Object used to customize the key derivation algorithm
 * @returns Iron sealed string
 */
declare const seal: (_crypto: _Crypto, object: unknown, password: RawPassword, options: SealOptions) => Promise<string>;
/**
 * Verifies, decrypts, and reconstruct an iron protocol string into an object.
 * @param _crypto Custom WebCrypto implementation
 * @param sealed The iron protocol string generated with seal()
 * @param password A string, buffer, or object
 * @param options Object used to customize the key derivation algorithm
 * @returns The verified decrypted object (can be null)
 */
declare const unseal: (_crypto: _Crypto, sealed: string, password: Password | password.Hash, options: SealOptions) => Promise<unknown>;

export { type EncryptionAlgorithm, type GenerateKeyOptions, type HMacResult, type IntegrityAlgorithm, type Key, type Password, type RawPassword, type SealOptions, type SealOptionsSub, type _Algorithm, algorithms, base64urlDecode, base64urlEncode, bufferToString, clone, decrypt, defaults, encrypt, generateKey, hmacWithPassword, macFormatVersion, macPrefix, password, randomBits, seal, stringToBuffer, unseal };
