import { z } from 'zod';
const rateLimitAction = z.enum(['rate_limit', 'rewrite']);
const rateLimitAlgorithm = z.enum(['sliding_window']);
const rateLimitAggregator = z.enum(['domain', 'ip']);
const slidingWindow = z.object({
    windowLimit: z.number(),
    windowSize: z.number(),
});
const rewriteActionConfig = z.object({
    to: z.string(),
});
export const rateLimit = z
    .object({
    action: rateLimitAction.optional(),
    aggregateBy: rateLimitAggregator.or(z.array(rateLimitAggregator)).optional(),
    algorithm: rateLimitAlgorithm.optional(),
})
    .merge(slidingWindow)
    .merge(rewriteActionConfig.partial());
/**
 * Takes a rate limiting configuration object and returns a traffic rules
 * object that is added to the manifest.
 */
export const getTrafficRulesConfig = (input) => {
    const { windowSize, windowLimit, algorithm, aggregateBy, action, to } = input;
    const rateLimitAgg = Array.isArray(aggregateBy) ? aggregateBy : [rateLimitAggregator.Enum.domain];
    const rewriteConfig = to ? { to: input.to } : undefined;
    return {
        action: {
            type: action || rateLimitAction.Enum.rate_limit,
            config: {
                ...rewriteConfig,
                rateLimitConfig: {
                    windowLimit,
                    windowSize,
                    algorithm: algorithm || rateLimitAlgorithm.Enum.sliding_window,
                },
                aggregate: {
                    keys: rateLimitAgg.map((agg) => ({ type: agg })),
                },
            },
        },
    };
};
