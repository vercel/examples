---
name: AWS Neptune Analytics with Next.js API Routes
slug: aws-neptune-analytics-nextjs-api-routes
description: Learn to use AWS Neptune Analytics with Next.js API Routes for graph database operations.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-neptune-analytics&project-name=aws-neptune-analytics&repository-name=aws-neptune-analytics&env=GRAPH_ID&envDescription=AWS%20Neptune%20Analytics%20Graph%20ID
---

# Next.js + AWS Neptune Analytics

This is an example of a Next.js application using AWS Neptune Analytics for creating, reading, updating, and deleting graph nodes and edges with OpenCypher queries.

## How to Use

### **Option 1: Use an existing Neptune Analytics graph.**

Retrieve your existing graph ID and ensure proper AWS credentials are configured. Provide the graph ID after clicking "Deploy" to automatically set the environment variable.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-neptune-analytics&project-name=aws-neptune-analytics&repository-name=aws-neptune-analytics&env=GRAPH_ID&envDescription=AWS%20Neptune%20Analytics%20Graph%20ID)

### **Option 2: Create a new Neptune Analytics graph.**

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/aws-neptune-analytics
```

1. Create a new [IAM role](https://aws.amazon.com/iam/) that includes permissions `neptune-graph:ReadDataViaQuery`, `neptune-graph:WriteDataViaQuery` and `neptune-graph:DeleteDataViaQuery`
2. Save the access key and secret key or configure AWS credentials (see [AWS CLI configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for details).
3. Create a new Neptune Analytics graph on AWS console
   In the Neptune Analytics Console, create a new graph with public endpoint enabled and 16 NCUs to start.
4. Save the graph ID from the Neptune Analytics console
5. Create an `.env.local` file and add your graph ID:
   ```
   GRAPH_ID=your-graph-id-here
   ```
   Alternatively, you can set it directly in your terminal:
   ```
   export GRAPH_ID=your-graph-id-here
   ```
6. Run `pnpm dev` to start the Next app at http://localhost:3000

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## Credentials and Environment Variables

AWS credentials (e.g. `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) and region configuration (e.g. `AWS_REGION`) can be used directly as environment variables for Vercel deployments.

The AWS SDK will automatically pick up these credentials from the environment:

```js
const client = new NeptuneGraphClient({})
```

## API Endpoints

The application provides a RESTful API for graph node and edge operations:

### Node Operations

- `GET /api/node?id={id}` - Retrieve a node by ID
- `POST /api/node` - Create a new node
- `PUT /api/node` - Update an existing node
- `DELETE /api/node?id={id}` - Delete a node and its relationships

### Edge Operations

- `GET /api/edge?id={id}` - Retrieve an edge by ID
- `POST /api/edge` - Create a new edge
- `PUT /api/edge` - Update an existing edge
- `DELETE /api/edge?id={id}` - Delete an edge

## Testing

### Create Node (POST)

```bash
curl -X POST http://localhost:3000/api/node \
  -d '{"id": "user-123", "name": "John Doe", "type": "user"}' \
  -H "Content-type: application/json"
```

### Get Node (GET)

```bash
curl "http://localhost:3000/api/node?id=user-123"
```

### Update Node (PUT)

```bash
curl -X PUT http://localhost:3000/api/node \
  -d '{"id": "user-123", "name": "John Smith", "type": "user", "active": true}' \
  -H "Content-type: application/json"
```

### Delete Node (DELETE)

```bash
curl -X DELETE "http://localhost:3000/api/node?id=user-123"
```

### Create Edge (POST)

```bash
curl -X POST http://localhost:3000/api/edge \
  -d '{"fromId": "user-123", "toId": "user-456", "type": "FOLLOWS"}' \
  -H "Content-type: application/json"
```

### Get Edge (GET)

```bash
curl "http://localhost:3000/api/edge?id=follows-001"
```

### Update Edge (PUT)

```bash
curl -X PUT http://localhost:3000/api/edge \
  -d '{"id": "follows-001", "since": "2024-01-15", "strength": "strong"}' \
  -H "Content-type: application/json"
```

### Delete Edge (DELETE)

```bash
curl -X DELETE "http://localhost:3000/api/edge?id=follows-001"
```
