const _EventTarget = EventTarget;
const defaultOptions = Object.freeze({
  bidir: true,
  stream: true
});
class WebSocketSSE extends _EventTarget {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;
  /* eslint-disable unicorn/no-null */
  onclose = null;
  onerror = null;
  onopen = null;
  onmessage = null;
  /* eslint-enable unicorn/no-null */
  binaryType = "blob";
  readyState = WebSocketSSE.CONNECTING;
  url;
  protocol = "";
  extensions = "";
  bufferedAmount = 0;
  #options = {};
  #sse;
  #id;
  #sendController;
  #queue = [];
  constructor(url, init) {
    super();
    this.url = url.replace(/^ws/, "http");
    if (typeof init === "string") {
      this.#options = { ...defaultOptions, protocols: init };
    } else if (Array.isArray(init)) {
      this.#options = { ...defaultOptions, protocols: init };
    } else {
      this.#options = { ...defaultOptions, ...init };
    }
    this.#sse = new EventSource(this.url);
    this.#sse.addEventListener("open", (_sseEvent) => {
      this.readyState = WebSocketSSE.OPEN;
      const event = new Event("open");
      this.onopen?.(event);
      this.dispatchEvent(event);
    });
    this.#sse.addEventListener("message", (sseEvent) => {
      const _event = new MessageEvent("message", {
        data: sseEvent.data
      });
      this.onmessage?.(_event);
      this.dispatchEvent(_event);
    });
    if (this.#options.bidir) {
      this.#sse.addEventListener("crossws-id", (sseEvent) => {
        this.#id = sseEvent.data;
        if (this.#options.stream) {
          fetch(this.url, {
            method: "POST",
            // @ts-expect-error
            duplex: "half",
            headers: {
              "content-type": "application/octet-stream",
              "x-crossws-id": this.#id
            },
            body: new ReadableStream({
              start: (controller) => {
                this.#sendController = controller;
              },
              cancel: () => {
                this.#sendController = void 0;
              }
            }).pipeThrough(new TextEncoderStream())
          }).catch(() => {
          });
        }
        for (const data of this.#queue) {
          this.send(data);
        }
        this.#queue = [];
      });
    }
    this.#sse.addEventListener("error", (_sseEvent) => {
      const event = new Event("error");
      this.onerror?.(event);
      this.dispatchEvent(event);
    });
    this.#sse.addEventListener("close", (_sseEvent) => {
      this.readyState = WebSocketSSE.CLOSED;
      const event = new Event("close");
      this.onclose?.(event);
      this.dispatchEvent(event);
    });
  }
  close(_code, _reason) {
    this.readyState = WebSocketSSE.CLOSING;
    this.#sse.close();
    this.readyState = WebSocketSSE.CLOSED;
  }
  async send(data) {
    if (!this.#options.bidir) {
      throw new Error("bdir option is not enabled!");
    }
    if (this.readyState !== WebSocketSSE.OPEN) {
      throw new Error("WebSocket is not open!");
    }
    if (!this.#id) {
      this.#queue.push(data);
      return;
    }
    if (this.#sendController) {
      this.#sendController.enqueue(data);
      return;
    }
    await fetch(this.url, {
      method: "POST",
      headers: {
        "x-crossws-id": this.#id
      },
      body: data
    });
  }
}

export { WebSocketSSE };
