// Node.js compatibility
if (!("global" in globalThis)) {
	globalThis.global = globalThis;
}
export default globalThis;
