export const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
export function redirect(url) {
    // eslint-disable-next-line no-throw-literal
    const error = new Error(REDIRECT_ERROR_CODE);
    error.digest = REDIRECT_ERROR_CODE + ';' + url;
    throw error;
}

//# sourceMappingURL=redirect.js.map