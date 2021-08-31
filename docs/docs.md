# Edge Functions Early Access Program

**Edge Middleware** is a Vercel technology that allows our customers to run Javascript code **at the Edge** right before a request is processed. Based on the incoming request shape, the customer can perform effects on the response such as rewriting, redirecting, adding headers or intercepting the request and respond. This enables a number of interesting features such as performing effects based on the user agent, A/B testing, country blocking, etc.

## How stable is it?

Edge Middleware currently works in production and can be deployed with Vercel but it is still **experimental technology**. You can use it in production **at your own risk** but we encourage you to wait for a stable release before using it in production with heavy traffic. We also invite you to test your use cases and to provide feedback to help us to validate and improve the feature. This includes of course testing out preview deployments with Vercel.

## Getting Started

Most Vercel customers build their website and apps using Next.JS so it is our first integration target. Edge Middleware is implemented for Next.JS on top of the most recent [canary release](https://github.com/vercel/next.js). You can get the most recent release that supports Edge Middleware from [this link](https://next-middleware-build.vercel.sh/latest) where [pinned versions](https://next-middleware-build.vercel.sh/next-v12.0.0-nightly.9.tgz) are available too. To start using it you can point in your `package.json` the `next` dependency to the distribution URL:

```json
"next": "https://next-middleware-build.vercel.sh/latest"
```

To keep it updated make sure you run `yarn --update` often so that an old version does not stick to your `yarn.lock` file. We will be cutting new releases often since this is an early and non-final release. Note that you can also pin to a specific version and update it manually or even download the zip file and point to it in your repository.

### Creating a Middleware

To start using a middleware in Next.JS you can create a special kind of file anywhere in your `pages/` folder called `_middleware`. Wether your middleware is invoked or not will depend on _where_ you define such file. There is an important difference on how it is invoked depending on the location:

- If you place the middleware file _at the root_ of your pages folder (`pages/_middleware.ts`) it will be called for **every single request**. Note this also includes static assets.
- If you place it _under a certain path_ within the pages folder (`pages/dashboard/_middleware.ts`) then your middleware will be invoked only for thouse *pages* that live under such route `/dashboard*`.

Because defining a middleware can increase latency we encourage you to use a specific path unless your use case requires activating the middleware for every single request. Note that you can have **more than one** middleware in your application.

The middleware file can export either a default or named function called `middleware`. The signature for the function is similar to an [Express.JS middleware](https://expressjs.com/en/guide/using-middleware.html) being the simplest example something like this:

```javascript
// pages/_middleware.ts
import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next';

export default function (req: EdgeRequest, res: EdgeResponse, next: EdgeNext) {
    res.setHeader('x-edge', '1');
    next();
}
```

The middleware above will simply add a header `x-edge` with the value `1` to every request that passes through. To test it out locally we can start Next.JS in development mode with `yarn dev` as usual. Then we can run a request to check the effect:

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

## Deploying to Vercel

Since we are using a custom release of Next.JS, building the app for production requires a custom builder that is aware of the middleware. We keep working on improvements for the Vercel Deployment pipeline and the builder is not used by default yet. This means you must tell Vercel that you want to use a very specific runtime for your app. For this, you must use a [_legacy_ property](https://vercel.com/docs/configuration#project/builds) in the `vercel.json` configuration file to specify the builder:

```json
{
  "builds": [{
    "src": "package.json",
    "use": "@vercelruntimes/next@0.0.1-dev.16"
  }]
}
```

That's the only requirement to deploy. After running a deploy with the proper builder and Next.JS versions, your deployment will be running your middleware functions automatically in production and will be available with no further action required.

## Middleware Function API

The middleware consists simply of a function (sync or async) that is called with three parameters: `EdgeRequest`, `EdgeResponse` and `EdgeNext`. This signature is inspired in the [Express.JS middleware](https://expressjs.com/en/guide/using-middleware.html) notation and the parameters that are passed to the function are a mixture of well-known Node.JS APIs and the Web Fetch standard.

The middleware function **MUST** either finish the request by writing a response or keep the request execution by imperatively calling `next`. Check below the API details and recall that if nothing is written in the response object and neither `next` i called, the request may hang until it times out.

### `EdgeRequest`

Represents an _incoming request_ passing through the middleware. It is simply an object where some request properties have been parsed and analyzed. Out of convenience we parse cookies and the user agent, and we also do a best-effort to pre-calculate the page that will match the request, the locale information and base URL. Finally, the `Headers` API is an implementation of the [Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Headers) standard. In production you will also see geolocation information and the origin IP for the request.

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

An object where you can express effects for the response that is a mixture between well-known Node.JS APIs and Web Standards. Among other things you can add headers to the response, set cookies or respond right away streaming content to the client. Note that, although you can perform effects on the response that don't require responding (such as adding headers), you must either respond or call `next` to express that the middleware is done with the request and therefore move forward.

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

When the middleware receives a request it is possible to respond using `EdgeResponse`, but in case you want to continue the execution of such request you can call `next`. Once it is done you can still execute code but you can't perform effects against the response. For example, you could call a tracker service without blocking the request:

```typescript
import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next';

export async function middleware(req: EdgeRequest, res: EdgeResponse, next: EdgeNext) {
    next();
    await fetch('https://my-tracking-server', {
        method: 'POST',
        body: JSON.stringify({ pathname: req.url.pathname })
    })
}
```

In this scenario there will be almost no latency added as we are continuing the execution right away but the middleware function will finish _after_ the POST happens. It is essential to either respond or call `next` **as soon as possible**.

## Function Runtime

Once the Edge Middleware is deployed it will run with a V8 Runtime and a limited set of APIs. It is for this reason that in development we will run the code in a sandbox that emulates the production Runtime to get you the best possible experience. Therefore there are some restrictions to write your functions:

- Node.JS is not supported. You can't use any Node.JS native APIs such as the filesystem or crypto.
- Node Modules can be used as long as they implement ESM and don't use Node.JS native APIs. We encourage you to use as little external modules as possible to keep your functions small and fast.
- You can use ESM and split your code into reusable files that we will bundle together when the application is built.
- Calling `require` directly is not allowed. If you do use it, it might work when the import path can be statically resolved, although we don't guarantee that it will still work in the future. Please use always ES Modules.

The following APIs are available in the runtime:

### Base64

- [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob) Decodes a string of data which has been encoded using base-64 encoding.
- [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa) Creates a base-64 encoded ASCII string from a string of binary data.

### Encoding

- [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) Takes a stream of code points as input and emits a stream of bytes (UTF8).
- [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) Takes a stream of bytes as input and emit a stream of code points.

### Environment

- `process.env` Holds an object with all enviroment variables for both production and development in the exact same way as any other page or API in Next.JS.

### Fetch

You can use the [Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) from the runtime. This enables some powerful use cases like using the middleware as a proxy or connecting to external storage APIs. You have to be careful with this though because the chances of adding latency are quite high. Consider that if you define a root Edge Middleware function running a fetch against a storage in Virginia and somebody access your platform from Tokio, there will be a request that has to be resolved from our Edge (closest to Tokio) to Virgina (origin of your storage), and that may happen before every single request making your site slow. When using the `fetch` API you must make sure it doesn't run for every single request and also ensure there is a good latency for the request.

### Streams

- [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) Consists of a pair of streams: a writable stream known as its writable side, and a readable stream, known as its readable side. Writes to the writable side result in new data being made available for reading from the readable side. Support for web streams is quite limited at the moment although it is more extended in the development environment.

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

It is very important to note that when your Next.JS app loads for the first time, the request will go through Vercel and the middleware may be applied altering routing (for example, for an A/B test). Once the application loads there is no hard navigation anymore and Next.JS keeps all state locally, routing in the client by running synchronous data requests to fetch server props when it is required. Being this the case, how can the middleware be invoked to calculate effects before the navigation happens? We implemented a protocol to make it possible that we called "preflight".

Whenever a Next.JS application loads it will keep a manifest internally with all routes that depend on a middleware. We use the prefetching lifecycle to do a special `HEAD` request with an internal header that asks the server for what will happen when the middleware gets invoked. This communication is based only on headers to make it as fast as possible and, in production, they will happen only on the prefetching phase so that there is no friction on navigation.

You may see these requests in the Network panel and you don't have to deal with them at all. It is this technology what allows us to calculate on front what is the right bundle to fetch. For example, say you have a middleware like:

```typescript
// pages/landing/_middleware
export const middleware = (req, res, next) => {
    if (req.url.pathname === '/landing' && req.cookies.bucket === 'b') {
        return res.rewrite('/landing/b');
    }
    
    next()
}
```

If the user goes to `/dashboard` where there is a link to `/landing`, Next.JS will see that this link depends on a middleware and it is possible that the bundle to fetch is not `landing/index.ts` so it will run a _preflight request_ to see if there is an effect to rewrite to `/landing/b` and if so, it will preload such bundle.

## Caveats

There are some important caveats to keep in mind when using the early access to Edge Middleware:

- The API for the Middleware function is **very likely** to completely change to be closer to the new Web Standards instead of implementing custom and Node.JS APIs. This is important to make a future-proof technology and you will _not_ get a major change in versioning once this happens.
- We are still working on logs so although you can use `console.log` locally, you will see no logs in Vercel.
- This is still **experimental technology** and we encourage you to not use it in production with heavy traffic.

## FAQ

### Does it affect performance?

You should see slightly more latency in general since it is literally impossible to take the same latency as if we were not running any code before processing the request. The amount of latency you will experience should not be much noticeable though (around `~40ms` according to our current metrics). Still we encourage you to not run any code before processing a response that you know ahead of time that will not have any effects on the response.

### To what extent can we move all of the application into `_middleware`?

Up to the you. We limit soon the size of Edge Functions to be somewhere around 1MB but for now you can move any amount of code. Because an Edge Middleware is intended to run _before_ requests, the less code it requires to run, the better so it is best to use Edge Middleware only for the purpose it is designed: preprocessing requests.

### What happens if I forged to call `next`?

If you didn't write any content in the response either, the middleware will hang and your request will do too ending in a timeout error.

### What happens if I add some code after `next`?

The code will be executed but the request will continue its execution right away. This means that after you called `next` you can't perform any effects on the response such as writing or adding headers, but you can run other effects like pinging a tracking service.

### Does `middleware` support returning an object to respond with JSON?

No. The only way to respond and interact with the response is by using the `response` object passed in the second parameter. The Middleware Function is expected to return either `void` or `Promise<void>`.

### How can I debug 500 errors coming from the Middleware in Vercel?

Once logging is implemented, we will wrap the Edge Function code and try to run it so if there is an error we will log it to `stderr` along with its trace. Therefore the error will be visible from the runtime logs. We don't support logging yet so for now there is no way to debug other than trying to reproduce the issue in development.

### Can I use NPM packages at the Edge?

Yes. When it is an ES Module that doesn't depend on Node.JS APIs we will bundle all code into the function. For example, you could bring some path regex checks into your middleware incorporating `path-to-regexp`.

## How to leave feedback

To report issues and leave feedback first make sure you are using the most recent version of both the runtime builder and Next.JS. Then if the issue persists you can open an issue in this repository with your feedback or request.
