---
name: AWS DynamoDB with Next.js API Routes
slug: aws-dynamodb-nextjs-api-routes
description: Learn to use AWS DynamoDB with Next.js API Routes.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-dynamodb&project-name=aws-dynamodb&repository-name=aws-dynamodb&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,TABLE_NAME&envDescription=AWS%20DynamoDB%20information%20and%20keys
---

# Next.js + AWS DynamoDB

This is an example of a Next.js application using DynamoDB for creating, updating, and deleting documents.

## Demo

https://alt-text-generator.vercel.app/

## How to Use

**Option 1: Use an existing table.**

Retrieve your existing access key, secret key, region and table name. Provide those values after clicking "Deploy" to automatically set the environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-dynamodb&project-name=aws-dynamodb&repository-name=aws-dynamodb&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,TABLE_NAME&envDescription=AWS%20DynamoDB%20information%20and%20keys)

**Option 2: Create a new table.**

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/aws-dynamodb
```

1. Create a new [IAM role](https://aws.amazon.com/iam/) with permission for `AmazonDynamoDBFullAccess`
1. Save the access key and secret key.
1. Create a new [DynamoDB table](https://aws.amazon.com/dynamodb/) with a primary key of `id` and type `String` (the sort key is optional).
1. Save the region and table name.
1. Create an `.env.local` file similar to `.env.local.example`.
1. Add the access key, secret key, region, and table name to `.env.local`.
1. Run `pnpm dev` to start the Next app at http://localhost:3000.

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## Credentials and Environment Variables

AWS credentials (e.g. `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) and region configuration (e.g. `AWS_REGION`) can now be used directly as environment variables for Vercel deployments.

These variables are the default names expected by the AWS SDK, which means the user no longer has to configure credentials when using it. For example, this code is no longer necessary:

```js
const s3 = new S3Client({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
})
```

Instead, it can be replaced with this:

```
const s3 = new S3Client({});
```

The SDK will pick up the credentials from the environment automatically.

## Testing

### PUT

```bash
curl -X PUT http://localhost:3000/api/item -d '{"content": "test"}' -H "Content-type: application/json"
```

### GET

```bash
curl http://localhost:3000/api/item\?id\=bdc38386-2b35-47a3-bdfc-8ee29bd0686f
```

### POST

```bash
curl -X POST http://localhost:3000/api/item -d '{"content": "updated", "id": "bdc38386-2b35-47a3-bdfc-8ee29bd0686f"}' -H "Content-type: application/json"
```

### DELETE

```bash
curl -X DELETE http://localhost:3000/api/item\?id\=bdc38386-2b35-47a3-bdfc-8ee29bd0686f
```
