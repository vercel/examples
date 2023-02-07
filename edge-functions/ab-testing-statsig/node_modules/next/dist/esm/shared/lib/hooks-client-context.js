"use client";
import { createContext } from 'react';

export const SearchParamsContext = createContext(null);
export const PathnameContext = createContext(null);
export const ParamsContext = createContext(null);
export const LayoutSegmentsContext = createContext(null);
if (process.env.NODE_ENV !== 'production') {
    SearchParamsContext.displayName = 'SearchParamsContext';
    PathnameContext.displayName = 'PathnameContext';
    ParamsContext.displayName = 'ParamsContext';
    LayoutSegmentsContext.displayName = 'LayoutSegmentsContext';
}

//# sourceMappingURL=hooks-client-context.js.map