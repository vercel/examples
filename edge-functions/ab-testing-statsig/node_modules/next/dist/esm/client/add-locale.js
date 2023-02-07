import { normalizePathTrailingSlash } from './normalize-trailing-slash';
export const addLocale = (path, ...args)=>{
    if (process.env.__NEXT_I18N_SUPPORT) {
        return normalizePathTrailingSlash(require('../shared/lib/router/utils/add-locale').addLocale(path, ...args));
    }
    return path;
};

//# sourceMappingURL=add-locale.js.map