---
name: AWS DynamoDB with Next.js API Routes
slug: aws-dynamodb-nextjs-api-routes
description: Learn to use AWS DynamoDB with Next.js API Routes.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-dynamodb&project-name=aws-dynamodb&repository-name=aws-dynamodb&env=ACCESS_KEY,SECRET_KEY,REGION,TABLE_NAME&envDescription=AWS%20DynamoDB%20information%20and%20keys
---

# Next.js + AWS DynamoDB

This is an example of a Next.js application using DynamoDB for creating, updating, and deleting documents.

## Getting Started

**Option 1: Use an existing table.**

Retrieve your existing access key, secret key, region and table name. Provide those values after clicking "Deploy" to automatically set the environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-dynamodb&project-name=aws-dynamodb&repository-name=aws-dynamodb&env=ACCESS_KEY,SECRET_KEY,REGION,TABLE_NAME&envDescription=AWS%20DynamoDB%20information%20and%20keys)

**Option 2: Create a new table.**

1. Create a new [IAM role](https://aws.amazon.com/iam/) with permission for `AmazonDynamoDBFullAccess`
1. Save the access key and secret key.
1. Create a new [DynamoDB table](https://aws.amazon.com/dynamodb/) with a primary key of `id` and type `String` (the sort key is optional).
1. Save the region and table name.
1. Create an `.env.local` file similar to `.env.local.example`.
1. Add the access key, secret key, region, and table name to `.env.local`.
1. Run `yarn dev` to start the Next app at `localhost:3000`.

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
