export class StatsigUninitializedError extends Error {
  constructor() {
    super('Call and wait for initialize() to finish first.');

    Object.setPrototypeOf(this, StatsigUninitializedError.prototype);
  }
}

export class StatsigInvalidArgumentError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, StatsigInvalidArgumentError.prototype);
  }
}
export class StatsigTooManyRequestsError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, StatsigTooManyRequestsError.prototype);
  }
}

export class StatsigLocalModeNetworkError extends Error {
  constructor() {
    super('No network requests in localMode');

    Object.setPrototypeOf(this, StatsigLocalModeNetworkError.prototype);
  }
}
