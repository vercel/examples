// npx -y node@22.14 -e 'const tls=require("tls");console.log(Object.entries(tls).filter(e => ["string", "number"].includes(typeof e[1])).map(([k,v]) => `export const ${k} = ${JSON.stringify(v)}`).join("\n"))'
export const CLIENT_RENEG_LIMIT = 3;
export const CLIENT_RENEG_WINDOW = 600;
export const DEFAULT_CIPHERS = "";
export const DEFAULT_ECDH_CURVE = "auto";
export const DEFAULT_MIN_VERSION = "TLSv1.2";
export const DEFAULT_MAX_VERSION = "TLSv1.3";
