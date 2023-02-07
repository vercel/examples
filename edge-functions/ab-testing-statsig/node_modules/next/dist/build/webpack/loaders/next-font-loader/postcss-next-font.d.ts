import type { AdjustFontFallback } from '../../../../font';
declare const postcssNextFontPlugin: {
    ({ exports, fontFamilyHash, fallbackFonts, adjustFontFallback, variable, weight, style, }: {
        exports: {
            name: any;
            value: any;
        }[];
        fontFamilyHash: string;
        fallbackFonts?: string[] | undefined;
        adjustFontFallback?: AdjustFontFallback | undefined;
        variable?: string | undefined;
        weight?: string | undefined;
        style?: string | undefined;
    }): {
        postcssPlugin: string;
        Once(root: any): void;
    };
    postcss: boolean;
};
export default postcssNextFontPlugin;
