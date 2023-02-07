import { addPathPrefix } from './add-path-prefix';
import { pathHasPrefix } from './path-has-prefix';
/**
 * For a given path and a locale, if the locale is given, it will prefix the
 * locale. The path shouldn't be an API path. If a default locale is given the
 * prefix will be omitted if the locale is already the default locale.
 */ export function addLocale(path, locale, defaultLocale, ignorePrefix) {
    if (locale && locale !== defaultLocale && (ignorePrefix || !pathHasPrefix(path.toLowerCase(), `/${locale.toLowerCase()}`) && !pathHasPrefix(path.toLowerCase(), '/api'))) {
        return addPathPrefix(path, `/${locale}`);
    }
    return path;
}

//# sourceMappingURL=add-locale.js.map