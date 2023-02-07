const SAME_SITE = [
    "strict",
    "lax",
    "none"
];
function parseSameSite(string) {
    string = string.toLowerCase();
    return SAME_SITE.includes(string) ? string : undefined;
}
function compact(t) {
    const newT = {};
    for(const key in t){
        if (t[key]) {
            newT[key] = t[key];
        }
    }
    return newT;
}
export function serialize(c) {
    const attrs = [
        "path" in c && c.path && `Path=${c.path}`,
        "expires" in c && c.expires && `Expires=${c.expires.toUTCString()}`,
        "maxAge" in c && c.maxAge && `Max-Age=${c.maxAge}`,
        "domain" in c && c.domain && `Domain=${c.domain}`,
        "secure" in c && c.secure && "Secure",
        "httpOnly" in c && c.httpOnly && "HttpOnly",
        "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`, 
    ].filter(Boolean);
    return `${c.name}=${encodeURIComponent(c.value ?? "")}; ${attrs.join("; ")}`;
}
/**
 * Parse a `Cookie` or `Set-Cookie header value
 */ export function parseCookieString(cookie) {
    const map = new Map();
    for (const pair of cookie.split(/; */)){
        if (!pair) continue;
        const [key, value] = pair.split("=", 2);
        map.set(key, decodeURIComponent(value ?? "true"));
    }
    return map;
}
/**
 * Parse a `Set-Cookie` header value
 */ export function parseSetCookieString(setCookie) {
    if (!setCookie) {
        return undefined;
    }
    const [[name, value], ...attributes] = parseCookieString(setCookie);
    const { domain , expires , httponly , maxage , path , samesite , secure  } = Object.fromEntries(attributes.map(([key, v])=>[
            key.toLowerCase(),
            v
        ]));
    const cookie = {
        name,
        value: decodeURIComponent(value),
        domain,
        ...expires && {
            expires: new Date(expires)
        },
        ...httponly && {
            httpOnly: true
        },
        ...typeof maxage === "string" && {
            maxAge: Number(maxage)
        },
        path,
        ...samesite && {
            sameSite: parseSameSite(samesite)
        },
        ...secure && {
            secure: true
        }
    };
    return compact(cookie);
}

//# sourceMappingURL=serialize.js.map