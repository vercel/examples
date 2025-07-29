class AdapterHookable {
  options;
  constructor(options) {
    this.options = options || {};
  }
  callHook(name, arg1, arg2) {
    const globalHook = this.options.hooks?.[name];
    const globalPromise = globalHook?.(arg1, arg2);
    const resolveHooksPromise = this.options.resolve?.(arg1);
    if (!resolveHooksPromise) {
      return globalPromise;
    }
    const resolvePromise = resolveHooksPromise instanceof Promise ? resolveHooksPromise.then((hooks) => hooks?.[name]) : resolveHooksPromise?.[name];
    return Promise.all([globalPromise, resolvePromise]).then(
      ([globalRes, hook]) => {
        const hookResPromise = hook?.(arg1, arg2);
        return hookResPromise instanceof Promise ? hookResPromise.then((hookRes) => hookRes || globalRes) : hookResPromise || globalRes;
      }
    );
  }
  async upgrade(request) {
    let context = request.context;
    if (!context) {
      context = {};
      Object.defineProperty(request, "context", {
        enumerable: true,
        value: context
      });
    }
    try {
      const res = await this.callHook(
        "upgrade",
        request
      );
      if (!res) {
        return { context };
      }
      if (res.ok === false) {
        return { context, endResponse: res };
      }
      if (res.headers) {
        return {
          context,
          upgradeHeaders: res.headers
        };
      }
    } catch (error) {
      const errResponse = error.response || error;
      if (errResponse instanceof Response) {
        return {
          context,
          endResponse: errResponse
        };
      }
      throw error;
    }
    return { context };
  }
}
function defineHooks(hooks) {
  return hooks;
}

function adapterUtils(peers) {
  return {
    peers,
    publish(topic, message, options) {
      let firstPeerWithTopic;
      for (const peer of peers) {
        if (peer.topics.has(topic)) {
          firstPeerWithTopic = peer;
          break;
        }
      }
      if (firstPeerWithTopic) {
        firstPeerWithTopic.send(message, options);
        firstPeerWithTopic.publish(topic, message, options);
      }
    }
  };
}
function defineWebSocketAdapter(factory) {
  return factory;
}

export { AdapterHookable as A, adapterUtils as a, defineWebSocketAdapter as b, defineHooks as d };
