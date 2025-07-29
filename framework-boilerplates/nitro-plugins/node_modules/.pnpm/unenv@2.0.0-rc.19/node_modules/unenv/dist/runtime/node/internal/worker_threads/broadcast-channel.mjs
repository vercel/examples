export class BroadcastChannel {
	name = "";
	onmessage = (message) => {};
	onmessageerror = (message) => {};
	close() {}
	postMessage(message) {}
	ref() {
		return this;
	}
	unref() {
		return this;
	}
}
