# Next.js Integration

To integrate Edge Middleware into Next.js we are serving a custom release that you can get from [here](https://next-middleware-build.vercel.sh/latest). You can make Next.js point to that version within your `package.json` adding the dependency such as:

```json
    "next": "https://next-middleware-build.vercel.sh/latest",
```

The to keep it updated make sure you run `yarn --update` so that an old version does not stick to your `yarn.lock` file. We will be cutting new releases often since this is an early non-final release. Note that you can also pin to a specific version or even download the zip file and put it in your repository.

## Getting Started

To start using a middleware in Next.js you can create a special kind of file anywhere in your `pages/` folder called `_middleware.ts`. Wether your middleware is invoked or not will depend on _where_ you define such file, There are two main options:

- If you locate the middleware file _at the root_ of your pages folder (`pages/_middleware.ts`) it will be called for **every single request**. Note this also includes static assets.
- If you place it _under a certain path_ within the pages folder (`pages/dashboard/_middleware.ts`) then your middleware will be invoked only for thouse *pages* that live under `/dashboard*`.

Because defining a middleware can increase latency we encourage you to use a specific path unless your use case requires activating the middleware for every single request. Note that you can have **more than one** middleware in your application.

The middleware file can export either a default or named function called `middleware`. The signature for the function is similar to an Express.js middleware and the simplest example would like like this:

```typescript
// pages/_middleware
import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next';

export default function (req: EdgeRequest, res: EdgeResponse, next: EdgeNext) {
    res.setHeader('x-edge', '1');
    next();
}
```

The middleware above will simply add a header to every request that passes through. To test it out locally we can start Next.js in development mode with `yarn dev` as usual and through a request:

```text
$ curl -I http://localhost:3000/non-existent-url

    HTTP/1.1 404 Not Found
    x-edge: 1
    Cache-Control: no-store, must-revalidate
    X-Powered-By: Next.js
    ETag: "8c5-1ogIJCJ2ho+y+v8s35JqxUDQ2t8"
    Content-Type: text/html; charset=utf-8
    Content-Length: 2245
    Vary: Accept-Encoding
    Date: Tue, 31 Aug 2021 12:56:13 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
```

## Function API

The middleware consists simply of a function (or async function) that is called with three parameters: an `EdgeRequest`, an `EdgeResponse` and a `next` function. This signature is comind from the Express.js Middleware notation and the parameters implement are a mixture of well-known Node.JS APIs and the fetch WHATWG standard.

The middleware function **MUST** either finish the response or continue execution by calling `next`. If none of this happens the request may hang until it times out.

### `EdgeRequest`

Represents an _incoming request_ to the middleware. It is simply an object where some request properties have been parsed and analyzed based on the Next.JS project configuration out of convenience. As seen below, we allow accessing parsed `cookies` in a request property. We also parse the _user agent_ telling if the request comes from a bot (a crawler, lighthouse, etc) along with extra information. We also do a best effort to pre-calculate the matching page, locale info, parameters, querystring, etc. Finally, the `Headers` API is an implementation of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Headers) standard. In production you will also see geolocation information and the origin IP for the request.

```typescript
interface EdgeRequest {
    geo: {
        city?: string;
        country?: string;
        region?: string;
    };
    headers: Headers;
    cookies: { [key: string]: string };
    ip?: string;
    method?: string;
    ua?: {
        browser: { major?: string; name?: string; version?: string; };
        cpu: { architecture?: string; };
        device: { model?: string; type?: string; vendor?: string; };
        engine: { name?: string; version?: string; };
        isBot: boolean;
        os: { name?: string; version?: string; };
    };
    url?: {
        basePath?: string;
        hash: string;
        hostname?: string | null;
        locale?: {
            defaultLocale: string;
            domain?: {
                defaultLocale: string;
                domain: string;
                http?: true;
                locales?: string[];
            };
            locale: string;
            path: {
                detectedLocale?: string;
                pathname: string;
            };
            redirect?: string;
            trailingSlash?: boolean;
        }
        page?: string;
        params?: { [key: string]: string };
        pathname: string;
        port?: string | null;
        protocol?: string | null;
        query: { [key: string]: string | string[]; };
        search: string;
    }
}
```

### `EdgeResponse`

An envelope where you can express effects for the response. It is a mixture between known Node.JS APIs and standard APIs. You can do things like adding headers, setting cookies using helpers and responding directly to the client with streamed data or any content. Note it is possible to perform some effects (like adding headers) without finishing the request. In such cases we can simply call `next` to express that we are done with the request and don't want to respond right away.

```typescript
interface EdgeResponse {
    body?: string | null | ReadableStream;
    clearCookie(name: string, opts?: CookieSerializeOptions): EdgeResponse;
    cookie(name: string, value: string, opts?: CookieSerializeOptions): EdgeResponse;
    cookies: { [key: string]: string };
    end(): void;
    finished: boolean;
    headers: Headers;
    headersSent: boolean;
    json(obj: { [key: string]: any }): void
    location?: string;
    redirect(location: string)
    redirect(status: number, location: string)
    rewriteLocation?: string;
    send(data?: string | number | boolean | ReadableString<Uint8Array>): void;
    setHeaders(headers: {[key: string]: value}): EdgeResponse;
    status(status: number): EdgeResponse;
    statusCode: number;
    write(chunk: any): void;
    writeHead(code: number, headers?: { [key: string]: string }): void;
}
```

### `EdgeNext`

When the middleware receives a request it is possible to respond using `EdgeResponse`. But in case we want to continue the execution maybe with some effect (like adding a header) we must call `next`. It is a function that can be called without parameters and it is used to express that we want to continue the execution maybe adding the effects reflected in the `response` object.

If there are no effects at all that is perfectly fine and it will simply continue execution as if there was no middleware at all.

## Function Runtime

Once the Edge Middleware is deployed it will run with V8 and a limited set of APIs. It is for this reason that in development we will run the code in a sandbox that emulates a production environment to get you the best possible experience. Therefore that are some restrictions to write your functions:

- Node.JS is not supported. You can't use any Node.JS native APIs such as the filesystem or crypto.
- Node Modules can be used as long as they implement ESM and don't use Node.JS native APIs. We encourage you to use as little as possible to keep your functions small and fast.
- You can use ESM and split your code into reusable files that we will bundle together when the application is built.
- Calling `require` directly is not allowed. If you do use it, it might work when the import path can be statically resolved, although we don't guarantee that it will still work. Please use always ES Modules.

The following APIs are available in the runtime:

### Fetch

You can use the [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) from the runtime. This enables some powerful use cases like using the middleware as a proxy or connecting to external storage APIs. You have to be careful with this though because the chances of adding latency are quite high. Consider that if you define a root Edge Middleware function running a fetch against a storage in Virginia and somebody access your platform from Tokio, there will be a request that has to be resolved from our Edge (closest to Tokio) to Virgina, and that may happen before every single request making your site sloppy. When using the `fetch` API you must make sure it doesn't run for every single request and also ensure there is a good latency for the request.

### Base64

- [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob) Decodes a string of data which has been encoded using base-64 encoding.
- [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa) Creates a base-64 encoded ASCII string from a string of binary data.

### Encoding

- [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) Takes a stream of code points as input and emits a stream of bytes (UTF8).
- [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) Takes a stream of bytes as input and emit a stream of code points.

### Environment

- `process.env` Holds an object with all enviroment variables in both production and development.

### Streams

- [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) Consists of a pair of streams: a writable stream known as its writable side, and a readable stream, known as its readable side. Writes to the writable side result in new data being made available for reading from the readable side. Support for web streams is limited for now.

### Timers

- [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) Schedules a function to execute every time a given number of milliseconds elapses.
- [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval) Cancels the repeated execution set using `setInterval()`.
- [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) Schedules a function to execute in a given amount of time.
- [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout) Cancels the delayed execution set using `setTimeout()`.

### Web

- [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) A WHATWG implementation of the headers API.
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) A WHATWG implementation of the URL API.
- [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) A WHATWG implementation of `URLSearchParams`.

## Preflight Requests

It is very important to note that when your Next.JS app loads for the first time, the request will go through Vercel and the middleware may be applied altering routing (for example, for an A/B test). Once the application loads there is no hard navigation anymore and Next.JS keeps all routing in the client running synchronous data requests to fetch server props when it is required. Being this the case, how can the middleware be invoked to calculate effects before the navigation happens? We implemented a protocol to make it possible that we called "preflight".

Whenever a Next.JS application loads it will keep a manifest internally with all routes that depend on a middleware. We use the prefetching lifecycle to do a special `HEAD` request with an internal header that pretty much asks the server for what will happen when the middleware gets invoked. This communication is based on headers to make it as fast as possible and, in production, they will happen only on the prefetching phase so that there is no friction on navigation.

You may see these requests in the Network pannel and you don't have to deal with them at all. It is this technology what allows us to calculate on front what is the right bundle to get. For example, say you have a middleware like:

```typescript
// pages/landing/_middleware
export const middleware = (req, res, next) => {
    if (req.url.pathname === '/landing' && req.cookies.bucket === 'b') {
        return res.rewrite('/landing/b');
    }
    
    next()
}
```

If the user goes to `/dashboard` where there is a link to `/landing`, Next.JS will see that this link depends on a middleware and it is possible that the bundle to fetch is not `landing/index.ts` so it will run a _preflight request_ to see if there is an effect to redirect to `/landing/b` and if so, it will preload such bundle.
