export function isInAmpMode({ ampFirst =false , hybrid =false , hasQuery =false ,  } = {}) {
    return ampFirst || hybrid && hasQuery;
}

//# sourceMappingURL=amp-mode.js.map