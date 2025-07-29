import { notImplemented } from "../_internal/utils.mjs";
import { UV_UDP_REUSEADDR, dlopen, errno, signals, priority } from "./internal/os/constants.mjs";
export const constants = {
	UV_UDP_REUSEADDR,
	dlopen,
	errno,
	signals,
	priority
};
const NUM_CPUS = 8;
export const availableParallelism = () => NUM_CPUS;
export const arch = () => "";
export const machine = () => "";
export const endianness = () => "LE";
export const cpus = () => {
	const info = {
		model: "",
		speed: 0,
		times: {
			user: 0,
			nice: 0,
			sys: 0,
			idle: 0,
			irq: 0
		}
	};
	return Array.from({ length: NUM_CPUS }, () => info);
};
export const getPriority = () => 0;
export const setPriority = /* @__PURE__ */ notImplemented("os.setPriority");
export const homedir = () => "/";
export const tmpdir = () => "/tmp";
export const devNull = "/dev/null";
export const freemem = () => 0;
export const totalmem = () => 0;
export const loadavg = () => [
	0,
	0,
	0
];
export const uptime = () => 0;
export const hostname = () => "";
export const networkInterfaces = () => {
	return { lo0: [
		{
			address: "127.0.0.1",
			netmask: "255.0.0.0",
			family: "IPv4",
			mac: "00:00:00:00:00:00",
			internal: true,
			cidr: "127.0.0.1/8"
		},
		{
			address: "::1",
			netmask: "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
			family: "IPv6",
			mac: "00:00:00:00:00:00",
			internal: true,
			cidr: "::1/128",
			scopeid: 0
		},
		{
			address: "fe80::1",
			netmask: "ffff:ffff:ffff:ffff::",
			family: "IPv6",
			mac: "00:00:00:00:00:00",
			internal: true,
			cidr: "fe80::1/64",
			scopeid: 1
		}
	] };
};
export const platform = () => "linux";
export const type = () => "Linux";
export const release = () => "";
export const version = () => "";
export const userInfo = (opts) => {
	const encode = (str) => {
		if (opts?.encoding) {
			const buff = Buffer.from(str);
			return opts.encoding === "buffer" ? buff : buff.toString(opts.encoding);
		}
		return str;
	};
	return {
		gid: 1e3,
		uid: 1e3,
		homedir: encode("/"),
		shell: encode("/bin/sh"),
		username: encode("root")
	};
};
export const EOL = "\n";
export default {
	arch,
	availableParallelism,
	constants,
	cpus,
	EOL,
	endianness,
	devNull,
	freemem,
	getPriority,
	homedir,
	hostname,
	loadavg,
	machine,
	networkInterfaces,
	platform,
	release,
	setPriority,
	tmpdir,
	totalmem,
	type,
	uptime,
	userInfo,
	version
};
