import { createNotImplementedError } from "../../../_internal/utils.mjs";
import { EventEmitter } from "node:events";
export class Domain extends EventEmitter {
	__unenv__ = true;
	members = [];
	add() {}
	enter() {}
	exit() {}
	remove() {}
	bind(callback) {
		throw createNotImplementedError("Domain.bind");
	}
	intercept(callback) {
		throw createNotImplementedError("Domain.intercept");
	}
	run(fn, ...args) {
		throw createNotImplementedError("Domain.run");
	}
}
