# Verify an RS256 JWT against a JWKS document using only the Python standard library.
# Usage: python3 verify_jwt.py <jwks.json> <token> <expected-issuer> [expected-audience]
import base64, hashlib, json, sys, time

def b64(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))

jwks, token, issuer = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
audience = sys.argv[4] if len(sys.argv) > 4 else None
head_b64, body_b64, sig_b64 = token.split(".")
header, claims = json.loads(b64(head_b64)), json.loads(b64(body_b64))
if header.get("alg") != "RS256":
    sys.exit(f"unexpected alg {header.get('alg')}")
key = next((k for k in jwks["keys"] if k.get("kid") == header.get("kid")), None)
if key is None:
    sys.exit(f"kid {header.get('kid')} not in JWKS")
n, e = int.from_bytes(b64(key["n"]), "big"), int.from_bytes(b64(key["e"]), "big")
sig = int.from_bytes(b64(sig_b64), "big")
em = pow(sig, e, n).to_bytes((n.bit_length() + 7) // 8, "big")
digest_info = bytes.fromhex("3031300d060960864801650304020105000420")  # SHA-256 DigestInfo prefix
expected = digest_info + hashlib.sha256(f"{head_b64}.{body_b64}".encode()).digest()
if em != b"\x00\x01" + b"\xff" * (len(em) - len(expected) - 3) + b"\x00" + expected:
    sys.exit("bad signature")
if claims.get("iss") != issuer:
    sys.exit(f"iss {claims.get('iss')} != {issuer}")
aud = claims.get("aud")
if audience and audience not in (aud if isinstance(aud, list) else [aud]):
    sys.exit(f"aud {aud} does not include {audience}")
if claims.get("exp", 0) < time.time():
    sys.exit("token expired")
print(f"kid={header['kid']} sub={claims.get('sub')}")
