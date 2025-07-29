import noop from "../mock/noop.mjs";
import { Socket } from "./internal/dgram/socket.mjs";
export { Socket } from "./internal/dgram/socket.mjs";
export const _createSocketHandle = noop;
export const createSocket = function() {
	return new Socket();
};
export default {
	Socket,
	_createSocketHandle,
	createSocket
};
