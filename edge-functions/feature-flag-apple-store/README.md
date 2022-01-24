# Apple Store

This examples uses [Upstash](https://upstash.com/) (Edge Redis Database) as storage for controlling whether the Apple Store is open or closed.

## Demo

https://edge-functions-feature-flag-apple-store.vercel.app

## Running Locally

After creating `.env.local` similar to `.env.example`, populate it with your Upstash secret from the console.

```bash
UPSTASH_SECRET=WrxcRWtL...
```

Then, you can start your application locally at `localhost:3000`:

```bash
$ npm run dev
```

## Opening / Closing the Store

We can use Upstash's REST API to update the kev/value store. Replace the URLs and Authorization tokens below with the values from your Upstash Redis instance.

**Open**

```bash
$ curl https://your-upstash-url.upstash.io/set/store-closed/false -H "Authorization: Bearer YOUR_TOKEN"
```

**Closed**

```bash
$ curl https://your-upstash-url.upstash.io/set/store-closed/true -H "Authorization: Bearer YOUR_TOKEN"
```
