// Minimal Wakeshift app client for the smoke test: Node.js standard library only (no SDK).
// Signs each request with the app key, as https://wakeshift.ai/docs/http-api describes.
//   node client.mjs <METHOD> <path under /api/apps/v1> [json body]
// Env: WAKESHIFT_KEY (wst_...), WAKESHIFT_CORE (e.g. http://localhost:8370).
import { createHash, createPrivateKey, createPublicKey, randomBytes, sign } from "node:crypto";
import { crc32 } from "node:zlib";

const key = (process.env.WAKESHIFT_KEY ?? "").trim();
const core = (process.env.WAKESHIFT_CORE ?? "").replace(/\/$/, "");
const [method, path, body] = process.argv.slice(2);

function seedOf(k) {
  const rest = k.replace(/^wst_/, "");
  if (rest.length === 50 && !rest.includes("_")) {
    const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let n = 0n;
    for (const ch of rest) n = n * 58n + BigInt(alphabet.indexOf(ch));
    const b = Buffer.from(n.toString(16).padStart(72, "0"), "hex");
    if (crc32(b.subarray(0, 32)) !== b.readUInt32BE(32)) throw new Error("mistyped key");
    return { seed: b.subarray(0, 32), appId: null };
  }
  const [, app, ...seed] = rest.split("_"); // test_<app>_<seed>
  return { seed: Buffer.from(seed.join("_"), "base64url"), appId: app };
}

const { seed, appId } = seedOf(key);
const pk = createPrivateKey({ key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]), format: "der", type: "pkcs8" });
const pub = Buffer.from(createPublicKey(pk).export({ format: "jwk" }).x, "base64url");
const kid = createHash("sha256").update(pub).digest().subarray(0, 16).toString("base64url");
const b64 = (v) => Buffer.from(JSON.stringify(v)).toString("base64url");
const iat = Math.floor(Date.now() / 1000);
const who = appId || kid;
const input = b64({ alg: "EdDSA", typ: "app+jwt", kid }) + "." +
  b64({ iss: who, sub: who, aud: core + "/api/apps", iat, exp: iat + 120, jti: randomBytes(16).toString("base64url") });
const jws = input + "." + sign(null, Buffer.from(input), pk).toString("base64url");

const res = await fetch(core + "/api/apps/v1" + path, {
  method,
  headers: { authorization: "Bearer " + jws, ...(body ? { "content-type": "application/json" } : {}) },
  body,
});
process.stdout.write(await res.text());
process.exitCode = res.ok ? 0 : 1;
