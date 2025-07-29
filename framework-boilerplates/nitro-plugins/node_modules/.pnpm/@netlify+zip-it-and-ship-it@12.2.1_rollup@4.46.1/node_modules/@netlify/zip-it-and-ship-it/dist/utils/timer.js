import { hrtime } from 'process';
const NANOSECS_TO_SECS = 1e9;
export const startTimer = function () {
    return hrtime();
};
// returns the time in nanoseconds
export const endTimer = function ([startSecs, startNsecs]) {
    const [endSecs, endNsecs] = hrtime();
    const durationNs = (endSecs - startSecs) * NANOSECS_TO_SECS + endNsecs - startNsecs;
    return durationNs;
};
