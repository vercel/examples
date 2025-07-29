export class Tracing {
	categories = "";
	enabled = false;
	disable() {
		this.enabled = false;
	}
	enable() {
		this.enabled = true;
	}
}
