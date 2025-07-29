const noopLogger = () => {
    // no-op
};
const getLogger = (systemLogger, debug = false) => {
    // If there is a system logger configured, we'll use that. If there isn't,
    // we'll pipe system logs to stdout if `debug` is enabled and swallow them
    // otherwise.
    const system = systemLogger ?? (debug ? console.log : noopLogger);
    return {
        system,
        user: console.log,
    };
};
export { getLogger };
