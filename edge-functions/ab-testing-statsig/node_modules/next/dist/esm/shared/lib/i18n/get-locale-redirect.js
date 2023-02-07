import _extends from "@swc/helpers/src/_extends.mjs";
import { acceptLanguage } from '../../../server/accept-header';
import { denormalizePagePath } from '../page-path/denormalize-page-path';
import { detectDomainLocale } from './detect-domain-locale';
import { formatUrl } from '../router/utils/format-url';
import { getCookieParser } from '../../../server/api-utils';
function getLocaleFromCookie(i18n, headers = {}) {
    var ref, ref1;
    const nextLocale = (ref = getCookieParser(headers || {})()) == null ? void 0 : (ref1 = ref.NEXT_LOCALE) == null ? void 0 : ref1.toLowerCase();
    return nextLocale ? i18n.locales.find((locale)=>nextLocale === locale.toLowerCase()) : undefined;
}
function detectLocale({ i18n , headers , domainLocale , preferredLocale , pathLocale  }) {
    return pathLocale || (domainLocale == null ? void 0 : domainLocale.defaultLocale) || getLocaleFromCookie(i18n, headers) || preferredLocale || i18n.defaultLocale;
}
function getAcceptPreferredLocale(i18n, headers) {
    if ((headers == null ? void 0 : headers['accept-language']) && !Array.isArray(headers['accept-language'])) {
        try {
            return acceptLanguage(headers['accept-language'], i18n.locales);
        } catch (err) {}
    }
}
export function getLocaleRedirect({ defaultLocale , domainLocale , pathLocale , headers , nextConfig , urlParsed  }) {
    if (nextConfig.i18n && nextConfig.i18n.localeDetection !== false && denormalizePagePath(urlParsed.pathname) === '/') {
        const preferredLocale = getAcceptPreferredLocale(nextConfig.i18n, headers);
        const detectedLocale = detectLocale({
            i18n: nextConfig.i18n,
            preferredLocale,
            headers,
            pathLocale,
            domainLocale
        });
        const preferredDomain = detectDomainLocale(nextConfig.i18n.domains, undefined, preferredLocale);
        if (domainLocale && preferredDomain) {
            const isPDomain = preferredDomain.domain === domainLocale.domain;
            const isPLocale = preferredDomain.defaultLocale === preferredLocale;
            if (!isPDomain || !isPLocale) {
                const scheme = `http${preferredDomain.http ? '' : 's'}`;
                const rlocale = isPLocale ? '' : preferredLocale;
                return `${scheme}://${preferredDomain.domain}/${rlocale}`;
            }
        }
        if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
            return formatUrl(_extends({}, urlParsed, {
                pathname: `${nextConfig.basePath || ''}/${detectedLocale}`
            }));
        }
    }
}

//# sourceMappingURL=get-locale-redirect.js.map