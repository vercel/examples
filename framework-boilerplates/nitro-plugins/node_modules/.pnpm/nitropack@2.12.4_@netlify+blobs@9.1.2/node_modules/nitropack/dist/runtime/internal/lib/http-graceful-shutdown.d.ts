/**
 * Gracefully shuts down `server` when the process receives
 * the passed signals
 *
 * @param {http.Server} server
 * @param {object} opts
 *        signals: string (each signal separated by SPACE)
 *        timeout: timeout value for forceful shutdown in ms
 *        forceExit: force process.exit() - otherwise just let event loop clear
 *        development: boolean value (if true, no graceful shutdown to speed up development
 *        preShutdown: optional function. Needs to return a promise. - HTTP sockets are still available and untouched
 *        onShutdown: optional function. Needs to return a promise.
 *        finally: optional function, handled at the end of the shutdown.
 */
declare function GracefulShutdown(server: any, opts: any): () => any;
export default GracefulShutdown;
