# Introduction

**Edge Middleware** is a Vercel technology that allows our customers to run Javascript code at the Edge right before a request is processed. Based on the incoming request shape, the customer can perform effects on the response such as rewriting, redirecting, adding headers or early responding. It enables a number of features such as browser detection effects, A/B testing or country blocking.

## How is it integrated?

Most Vercel customers build their website and apps using Next.js so it was our first integration target. Edge Middleware is implemented for Next.js on top of the most recent canary release. You can get the most recent version from [this link](https://next-middleware-build.vercel.sh/latest) where [pinned versions](https://next-middleware-build.vercel.sh/next-v12.0.0-nightly.9.tgz) are available as well. To start using this version you can point `nextjs` to use one of these versions using the URL. You can check further information about how Edge Middleware works with Next.js below.

## How is it deployed?

Since we are using a custom cut of Next.js, the way we build it is slightly different. We keep working on improvements for the Vercel Deployment pipeline and the release is not official yet so you must force a specific runtime to build your app. For this, you must use a _deprecated_ property in the `vercel.json` configuration file to specify the runtime:

```json
{
  "builds": [{
    "src": "package.json",
    "use": "@vercelruntimes/next@0.0.1-dev.16"
  }]
}
```

That's the only requirement. After pushing a commit with the proper build runtime and Next.js version, your middleware will become automatically deployed and available without any other action.

## How stable is it?

As of today everything should work in general although we are lacking some essential features we are currently working on such as logging. Although it should pretty much work in production you should use it at **your own risk**. This is an **experimental technology** that must be tested further and still requires validation. We encourage you to test your use cases though and deploy, at least preview deployments, to provide feedback and help us validating and improving it.

## Does it affect performance?

You should see slightly more latency in general since it is literally impossible to take the same latency as if we were not running any code before processing the result. The amount of latency you will experience should not be much noticeable though (around `~40ms` according to our current metrics). Still we encourage you to not run any code before processing a response that you know ahead of time that will not receive any effects. You can learn about this with the Next.js integration section.
