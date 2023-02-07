type Entry = {
  expiry: number;
  promise: Promise<unknown>;
  taskCompleted: boolean;
  resolver?: ((value: Response | PromiseLike<Response>) => void) | null;
  rejector?: ((error?: any) => void) | null;
};

export default class Dispatcher {
  private queue: Entry[];
  private drainInterval: number;
  private drainTimer: NodeJS.Timer;

  constructor(drainIntervalms = 200) {
    this.queue = [];
    this.drainInterval = drainIntervalms;
    this.drainTimer = this._scheduleDrain();
  }

  public enqueue(
    promise: Promise<Response>,
    timeoutms: number,
  ): Promise<Response> {
    let entry: Entry = {
      expiry: Date.now() + timeoutms,
      promise: promise,
      taskCompleted: false,
      resolver: null,
      rejector: null,
    };

    const dispatcherPromise = new Promise<Response>((res, rej) => {
      entry.resolver = res;
      entry.rejector = rej;
    });

    this.queue.push(entry);

    const markCompleted = ((e: Entry) => {
      e.taskCompleted = true;
    }).bind(this);

    promise.then(
      (result) => {
        markCompleted(entry);
        if (entry.resolver != null) {
          entry.resolver(result);
        }
        return result;
      },
      (err) => {
        markCompleted(entry);
        if (entry.rejector != null) {
          entry.rejector();
        }
        return err;
      },
    );

    return dispatcherPromise;
  }

  private _scheduleDrain(): NodeJS.Timer {
    const drain = setTimeout(this._drainQueue.bind(this), this.drainInterval);
    if (drain.unref) {
      drain.unref();
    }
    return drain;
  }

  private _drainQueue() {
    let oldQueue = this.queue;
    this.queue = [];
    const now = Date.now();
    oldQueue.forEach((entry) => {
      if (!entry.taskCompleted) {
        if (entry.expiry > now) {
          this.queue.push(entry);
        } else {
          if (entry.rejector != null) {
            entry.rejector('time_out');
          }
        }
      }
    }, this);

    this.drainTimer = this._scheduleDrain();
  }

  public shutdown() {
    if (this.drainTimer != null) {
      clearTimeout(this.drainTimer);
    }
  }
}
