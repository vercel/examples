import type { webpack } from 'next/dist/compiled/webpack/webpack';
export declare function getClientStyleLoader({ hasAppDir, isDevelopment, assetPrefix, }: {
    hasAppDir: boolean;
    isDevelopment: boolean;
    assetPrefix: string;
}): webpack.RuleSetUseItem;
