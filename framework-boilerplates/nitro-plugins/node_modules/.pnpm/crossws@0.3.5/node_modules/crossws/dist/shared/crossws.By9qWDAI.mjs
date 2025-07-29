class WSError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "WSError";
  }
}

export { WSError as W };
