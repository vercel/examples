import { Nitro, RollupConfig } from 'nitropack/types';

declare const getRollupConfig: (nitro: Nitro) => RollupConfig;

export { getRollupConfig };
