import { z } from 'zod';
export const NODE_BUNDLER = {
    ESBUILD: 'esbuild',
    ESBUILD_ZISI: 'esbuild_zisi',
    NFT: 'nft',
    ZISI: 'zisi',
    NONE: 'none',
};
export const nodeBundler = z.nativeEnum(NODE_BUNDLER);
