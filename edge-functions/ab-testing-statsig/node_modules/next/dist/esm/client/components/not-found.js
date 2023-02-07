export const NOT_FOUND_ERROR_CODE = 'NEXT_NOT_FOUND';
export function notFound() {
    // eslint-disable-next-line no-throw-literal
    const error = new Error(NOT_FOUND_ERROR_CODE);
    error.digest = NOT_FOUND_ERROR_CODE;
    throw error;
}

//# sourceMappingURL=not-found.js.map