export const detectDomainLocale = (...args)=>{
    if (process.env.__NEXT_I18N_SUPPORT) {
        return require('../shared/lib/i18n/detect-domain-locale').detectDomainLocale(...args);
    }
};

//# sourceMappingURL=detect-domain-locale.js.map