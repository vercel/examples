// https://nodejs.org/api/process.html
import { Process } from "./internal/process/process.mjs";
import { env as UnenvEnv } from "./internal/process/env.mjs";
import { hrtime as UnenvHrTime } from "./internal/process/hrtime.mjs";
import { nextTick as UnenvNextTick } from "./internal/process/nexttick.mjs";
const unenvProcess = new Process({
	env: UnenvEnv,
	hrtime: UnenvHrTime,
	nextTick: UnenvNextTick
});
export default unenvProcess;
export const { abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, exit, finalization, features, getBuiltinModule, getActiveResourcesInfo, getMaxListeners, hrtime, kill, listeners, listenerCount, memoryUsage, nextTick, on, off, once, pid, platform, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, ref, unref, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding } = unenvProcess;
