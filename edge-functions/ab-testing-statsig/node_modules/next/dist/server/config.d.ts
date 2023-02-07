import { NextConfigComplete, NextConfig } from './config-shared';
export { DomainLocale, NextConfig, normalizeConfig } from './config-shared';
export declare function setHttpClientAndAgentOptions(config: {
    httpAgentOptions?: NextConfig['httpAgentOptions'];
    experimental?: {
        enableUndici?: boolean;
    };
}): void;
export default function loadConfig(phase: string, dir: string, customConfig?: object | null, rawConfig?: boolean): Promise<NextConfigComplete>;
