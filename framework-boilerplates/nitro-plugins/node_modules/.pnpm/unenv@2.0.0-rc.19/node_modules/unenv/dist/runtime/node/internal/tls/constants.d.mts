// npx -y node@22.14 -e 'const tls=require("tls");console.log(Object.entries(tls).filter(e => ["string", "number"].includes(typeof e[1])).map(([k,v]) => `export const ${k} = ${JSON.stringify(v)}`).join("\n"))'
export declare const CLIENT_RENEG_LIMIT = 3;
export declare const CLIENT_RENEG_WINDOW = 600;
export declare const DEFAULT_CIPHERS = "";
export declare const DEFAULT_ECDH_CURVE = "auto";
export declare const DEFAULT_MIN_VERSION = "TLSv1.2";
export declare const DEFAULT_MAX_VERSION = "TLSv1.3";
