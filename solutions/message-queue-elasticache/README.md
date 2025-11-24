---
name: Message Queue with AWS ElastiCache and Next.js
slug: message-queue-elasticache
description: Learn to use AWS ElastiCache (Valkey) with Next.js API Routes for reliable message queue processing using streams.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/message-queue-elasticache&project-name=message-queue-elasticache&repository-name=message-queue-elasticache&env=VALKEY_ENDPOINT&envDescription=Valkey%20endpoint%20URL
---

# Next.js + AWS ElastiCache Message Queue

This is an example of a Next.js application using AWS ElastiCache (Valkey) for implementing a reliable message queue with streams. The template demonstrates a contact form processor where messages are queued, consumed, and acknowledged using Valkey's streaming capabilities.

## How to Use

This template demonstrates the code pattern for implementing message queues with Valkey streams. It's designed to work with AWS ElastiCache in production environments.

### Local Development

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/message-queue-elasticache
```

**Run Valkey locally:**

Using Docker:

```bash
docker run -d -p 6379:6379 valkey/valkey-bundle:latest
```

Or install Valkey directly following the [official installation guide](https://valkey.io/download/).

**Configure environment:**

Create an `.env.local` file:

```bash
VALKEY_ENDPOINT=localhost:6379
```

**Start the development server:**

```bash
pnpm dev
```

Visit <http://localhost:3000> to see the application.

### Production Deployment with AWS ElastiCache

AWS ElastiCache clusters run within a VPC (private network), which requires network connectivity setup for production deployments on Vercel.

#### Networking Requirements

**For Vercel Enterprise customers**, connectivity to AWS ElastiCache is available through [Vercel Secure Compute](https://vercel.com/docs/connectivity/secure-compute), which enables private network access between Vercel Functions and AWS VPC resources.

**High-level setup steps:**

**AWS Side:**

1. Create an ElastiCache for Valkey cluster (version 7.0+) in your AWS VPC
2. Configure security groups to allow traffic from Vercel's CIDR block
3. Set up VPC peering or AWS PrivateLink based on your architecture
4. Note the cluster endpoint URL

**Vercel Side:**

1. Contact Vercel to enable Secure Compute for your Enterprise account
2. Coordinate with Vercel to receive your dedicated CIDR block
3. Add the ElastiCache endpoint to your project environment variables:

   ```bash
   VALKEY_ENDPOINT=your-cluster.cache.amazonaws.com:6379
   ```

4. Deploy your application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/message-queue-elasticache&project-name=message-queue-elasticache&repository-name=message-queue-elasticache&env=VALKEY_ENDPOINT&envDescription=Valkey%20endpoint%20URL)

For detailed networking configuration, refer to the [Vercel Secure Compute documentation](https://vercel.com/docs/connectivity/secure-compute).

## How It Works

This template demonstrates a reliable serverless message queue workflow:

1. **Producer**: A visitor submits a contact form, and the message is immediately written to a Valkey stream
2. **Consumer**: A reviewer opens the processing view, which reads the next unhandled message from the consumer group
3. **Acknowledgment**: When the reviewer confirms, the app acknowledges the message and removes it from the pending list

**Key Features:**

- Single consumer group prevents message duplication
- Message acknowledgment ensures reliable processing
- Refreshing the page won't cause duplicate processing
- Demonstrates how ElastiCache Streams support reliable serverless workflows

## API Endpoints

The application provides three API routes demonstrating the message queue pattern:

### Message Operations

- `POST /api/messages/produce` - Add a new message to the queue (contact form submission)
- `GET /api/messages/consume` - Read the next unprocessed message from the consumer group
- `POST /api/messages/acknowledge` - Acknowledge and remove a message from the pending list

## Testing

### Produce Message (Contact Form Submission)

```bash
curl -X POST http://localhost:3000/api/messages/produce \
  -d '{"name": "John Doe", "email": "john@example.com", "message": "Hello!"}' \
  -H "Content-type: application/json"
```

### Consume Message (Get Next Pending)

```bash
curl http://localhost:3000/api/messages/consume
```

### Acknowledge Message (Mark as Processed)

```bash
curl -X POST http://localhost:3000/api/messages/acknowledge \
  -d '{"messageId": "1234567890123-0"}' \
  -H "Content-type: application/json"
```
