<p align="center">
  <a href="https://vercel.com">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Edge Functions</h3>
  </a>
</p>

Welcome to Vercel's Early Access Program for Edge Functions. We're excited you're here! In this repository, you'll find everything you need to get started using our new Edge Functions and Middleware.

## About Edge Functions

Edge Functions allow you to run JavaScript code at the Edge before a request is processed. Based on the incoming request, you can modify the response by rewriting, redirecting, adding headers, and more before responding. This enables a number of interesting features such as performing effects based on the user agent, A/B testing, country blocking, etc.

One of the easiest ways to introduce Edge Functions into your stack is as Middleware, and the use-cases for Edge Middleware include:

- **Experimentation:** A/B Testing and Feature Flags
- **Security:** Protecting your site from attacks and bots
- **Dynamic Routing:** Decide what page to serve, with code.
- **Observability and Logging:** No client-side scripts needed!
- **Dynamic Headers**
- **Authentication**

When you define Middleware as part of your Next.js application, Vercel deploys each Edge Function globally. Unlike Serverless Functions, Edge Functions have **no cold boots** and run automatically in every region of Vercel's Edge Network.

## Requirements

1. Install the [packed version](https://next-middleware-build.vercel.sh/latest) of Next. Since it's an unreleased version of Next.js, you will have to point to this version from `package.json`.

2. The runtime required to build Next.js with Edge Middleware in production is not yet public. You will need to require the project to use the specific Vercel builder inside your `vercel.json` file.

Find the most recent version for both Next and builder [listed here](https://next-middleware-build.vercel.sh/latest.json). View the [examples](/examples) to get started.

## Read the Docs

We are writing the docs similarily to how we write code: iteratively and alongside the featureset. You can [read the docs here](https://github.com/vercel-customer-feedback/edge-middleware/blob/main/docs/docs.md), they're part of this repository. If you have any questions or suggestions about the docs, feel free to [open a discussion](https://github.com/vercel-customer-feedback/edge-middleware/discussions), or [submit a PR](https://github.com/vercel-customer-feedback/edge-middleware/pulls) with your suggestions!

## Provide Feedback

We are collecting feedback right here in this repo using Discussions and Issues. How do you know if you should open a discussion or an issue?

1. **Discussion post:** a question, piece of feedback, or idea you have about the feature that you would like to discuss with the team.
2. **Issue:** Open a GitHub issue if you believe you've encountered a bug that you want to flag for the team. We may commend and kick off a conversation about the bug in the issue thread.
