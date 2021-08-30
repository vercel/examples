### Welcome to the Early Access Program (EAP) for Edge Middleware

We're excited to have you participate in Vercel's EAPs. In this repository, you will find everything you need to get started testing Vercel's Edge Middleware features.  

**How to use this repository**

1. Download the [packed version](https://next-middleware-build.vercel.sh/next-v12.0.0-nightly.7.tgz) of Next. Since it's an unreleased version of Next.js, you will have to point to this version from the package.json in your repo.

2. The runtime required to build Next.js with the Edge Middleware is not publish yet either so you will have to require the project to use the specific dev builder version like in the [`vercel.json`](vercel.json#L5) file of this repo.