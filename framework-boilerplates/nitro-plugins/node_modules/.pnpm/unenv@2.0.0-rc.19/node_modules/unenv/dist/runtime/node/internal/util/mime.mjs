// https://nodejs.org/api/util.html#class-utilmimetype
export class MIMEType {
	__unenv__ = true;
	params = new MIMEParams();
	type;
	subtype;
	constructor(input) {
		const [essence = "", ...params] = String(input).split(";");
		const [type = "", subtype = ""] = essence.split("/");
		this.type = type;
		this.subtype = subtype;
		this.params = new MIMEParams();
		for (const param of params) {
			const [name, value] = param.split("=");
			this.params.set(name, value);
		}
	}
	get essence() {
		return this.type + "/" + this.subtype;
	}
	toString() {
		const paramsStr = this.params.toString();
		return this.essence + (paramsStr ? `;${paramsStr}` : "");
	}
}
// https://nodejs.org/api/util.html#util_class_util_mimeparams
export class MIMEParams extends Map {
	__unenv__ = true;
	get(name) {
		return super.get(name) || null;
	}
	toString() {
		return [...this.entries()].map(([name, value]) => `${name}=${value}`).join("&");
	}
}
