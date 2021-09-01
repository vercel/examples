# FAQ for Edge Functions

_The contents of this document will likely be incorporated into the documentation over time. Feel free to [suggest more questions](https://github.com/vercel-customer-feedback/edge-middleware/discussions/new) as they come up._ 

## How stable is it?

Edge Middleware currently works in production and can be deployed with Vercel but it is still **experimental technology**. You can use it in production **at your own risk** but we encourage you to wait for a stable release before using it in production with heavy traffic. We also invite you to test your use cases and to provide feedback to help us to validate and improve the feature. This includes of course testing out preview deployments with Vercel.

### Does it affect performance?

You should see slightly more latency in general since it is literally impossible to take the same latency as if we were not running any code before processing the request. The amount of latency you will experience should not be much noticeable though (around `~40ms` according to our current metrics). Still we encourage you to not run any code before processing a response that you know ahead of time that will not have any effects on the response.

### To what extent can we move all of the application into `_middleware`?

Up to the you. Soon we will limit the size of Edge Functions to be somewhere around 1MB. For now you can move any amount of code. Because an Edge Middleware is intended to run _before_ requests, the less code it requires to run, the better so it is best to use Edge Middleware only for the purpose it is designed: preprocessing requests.

### What happens if I forget to call `next`?

If you didn't write any content in the response either, the middleware will hang and your request will end in a timeout error.

### What happens if I add some code after `next`?

The code will be executed but the request will continue its execution right away. This means that after you called `next` you can't perform any effects on the response such as writing or adding headers, but you can run other effects like pinging a tracking service.

### Does `middleware` support returning an object to respond with JSON?

No. The only way to respond and interact with the response is by using the `response` object passed in the second parameter. The Middleware Function is expected to return either `void` or `Promise<void>`.

### How can I debug 500 errors coming from the Middleware in Vercel?

Once logging is implemented, we will wrap the Edge Function code and try to run it so if there is an error we will log it to `stderr` along with its trace. Therefore the error will be visible from the runtime logs. We don't support logging yet so for now there is no way to debug other than trying to reproduce the issue in development.

### Can I use NPM packages at the Edge?

Yes. When it is an ES Module that doesn't depend on Node.JS APIs we will bundle all code into the function. For example, you could bring some path regex checks into your middleware incorporating `path-to-regexp`.

## How to leave feedback

To report issues and leave feedback first make sure you are using the most recent version of both the runtime builder and Next.JS. Then, if the issue persists, you can open an issue in this repository with your feedback or request.
