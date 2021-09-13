# Welcome to the Early Access Program (EAP) for Edge Functions

We're excited to have you participate in Vercel's EAPs. In this repository, you will find everything you need to get started testing Vercel's Edge Middleware features.

## About Edge Functions

Edge Functions is a Vercel technology that allows our customers to run Javascript code at the Edge right before a request is processed. Based on the incoming request shape, the customer can perform effects on the response such as rewriting, redirecting, adding headers or intercepting the request and respond. This enables a number of interesting features such as performing effects based on the user agent, A/B testing, country blocking, etc.

One of the easiest ways to introduce Edge Functions into your stack is as middleware, and the use-cases for Edge Middleware include:

- Experimentation: A/B Testing and Feature Flags
- Security: Protecting your site from attacks and bots
- Dynamic Routing: Decide what page to serve, with code.
- Dynamic Headers
- Observability and Logging without client-side scripts
- Authentication

When you define and deploy middleware as part of your Next.js application, we deploy them globally as Edge Functions that respond instantly to user requests. Unlike Serverless Functions, there are no cold boots and they run automatically in every region of our Edge Network.

## Requirements:

1. Install the [packed version](https://next-middleware-build.vercel.sh/latest) of Next. Since it's an unreleased version of Next.js, you will have to point to this version from [`package.json`](package.json#L12).

2. The runtime required to build Next.js with Edge Middleware in production is not published yet either so you will have to require the project to use the specific dev builder version like in the [`vercel.json`](vercel.json#L5) file of this repo.

## Read the docs:

We are writing the docs similarily to how we write code: iteratively and alongside the featureset. You can [read the docs here](https://github.com/vercel-customer-feedback/edge-middleware/blob/main/docs/docs.md), they're part of this repository. If you have any questions or suggestions about the docs, feel free to [open a discussion](https://github.com/vercel-customer-feedback/edge-middleware/discussions), or [submit a PR](https://github.com/vercel-customer-feedback/edge-middleware/pulls) with your suggestions!

## Provide feedback:

We are collecting feedback right here in this repo using Discussions and Issues. How do you know if you should open a discussion or an issue?

1. **Discussion post:** a question, piece of feedback, or idea you have about the feature that you would like to discuss with the team.
2. **Issue:** Open a GitHub issue if you believe you've encountered a bug that you want to flag for the team. We may commend and kick off a conversation about the bug in the issue thread.
