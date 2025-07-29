import { parse } from "cookie-es";
import { splitCookiesString } from "h3";
export function getAzureParsedCookiesFromHeaders(headers) {
  const setCookieHeader = headers["set-cookie"];
  if (!setCookieHeader || typeof setCookieHeader === "number" || setCookieHeader.length === 0) {
    return [];
  }
  const azureCookies = [];
  for (const setCookieStr of splitCookiesString(setCookieHeader)) {
    const setCookie = Object.entries(parse(setCookieStr));
    if (setCookie.length === 0) {
      continue;
    }
    const [[key, value], ..._setCookieOptions] = setCookie;
    const setCookieOptions = Object.fromEntries(
      _setCookieOptions.map(([k, v]) => [k.toLowerCase(), v])
    );
    const cookieObject = {
      name: key,
      value,
      domain: setCookieOptions.domain,
      path: setCookieOptions.path,
      expires: parseNumberOrDate(setCookieOptions.expires),
      sameSite: setCookieOptions.samesite,
      maxAge: parseNumber(setCookieOptions["max-age"]),
      secure: setCookieStr.includes("Secure") ? true : void 0,
      httpOnly: setCookieStr.includes("HttpOnly") ? true : void 0
    };
    azureCookies.push(cookieObject);
  }
  return azureCookies;
}
function parseNumberOrDate(expires) {
  const expiresAsNumber = parseNumber(expires);
  if (expiresAsNumber !== void 0) {
    return expiresAsNumber;
  }
  const expiresAsDate = new Date(expires);
  if (!Number.isNaN(expiresAsDate.getTime())) {
    return expiresAsDate;
  }
}
function parseNumber(maxAge) {
  if (!maxAge) {
    return void 0;
  }
  const maxAgeAsNumber = Number(maxAge);
  if (!Number.isNaN(maxAgeAsNumber)) {
    return maxAgeAsNumber;
  }
}
