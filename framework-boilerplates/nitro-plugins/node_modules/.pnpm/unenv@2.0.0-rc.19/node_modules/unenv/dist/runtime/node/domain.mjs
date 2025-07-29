import { Domain } from "./internal/domain/domain.mjs";
export { Domain } from "./internal/domain/domain.mjs";
export const create = function() {
	return new Domain();
};
export const createDomain = create;
const _domain = create();
export const active = () => _domain;
export const _stack = [];
export default {
	Domain,
	_stack,
	active,
	create,
	createDomain
};
