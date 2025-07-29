import { z } from 'zod';
export interface TrafficRules {
    action: {
        type: string;
        config: {
            rateLimitConfig: {
                algorithm: string;
                windowSize: number;
                windowLimit: number;
            };
            aggregate: {
                keys: {
                    type: string;
                }[];
            };
            to?: string;
        };
    };
}
export declare const rateLimit: z.ZodObject<{
    action: z.ZodOptional<z.ZodEnum<["rate_limit", "rewrite"]>>;
    aggregateBy: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["domain", "ip"]>, z.ZodArray<z.ZodEnum<["domain", "ip"]>, "many">]>>;
    algorithm: z.ZodOptional<z.ZodEnum<["sliding_window"]>>;
} & {
    windowLimit: z.ZodNumber;
    windowSize: z.ZodNumber;
} & {
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    windowLimit: number;
    windowSize: number;
    to?: string | undefined;
    action?: "rate_limit" | "rewrite" | undefined;
    aggregateBy?: "domain" | "ip" | ("domain" | "ip")[] | undefined;
    algorithm?: "sliding_window" | undefined;
}, {
    windowLimit: number;
    windowSize: number;
    to?: string | undefined;
    action?: "rate_limit" | "rewrite" | undefined;
    aggregateBy?: "domain" | "ip" | ("domain" | "ip")[] | undefined;
    algorithm?: "sliding_window" | undefined;
}>;
type RateLimit = z.infer<typeof rateLimit>;
/**
 * Takes a rate limiting configuration object and returns a traffic rules
 * object that is added to the manifest.
 */
export declare const getTrafficRulesConfig: (input: RateLimit) => TrafficRules | undefined;
export {};
