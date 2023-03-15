---
name: AWS S3 Image Upload
slug: aws-s3-image-upload
description: Learn to use AWS S3 to upload images to your bucket.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-s3-image-upload&project-name=aws-s3-image-upload&repository-name=aws-s3-image-upload&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,BUCKET_NAME
---

# Next.js + AWS S3 Upload

This is an example of a Next.js application allowing you to upload photos to an S3 bucket.

## How to Use

**Option 1: Use an existing S3 bucket.**

Retrieve your existing access key, secret key, S3 bucket region and name. Provide those values after clicking "Deploy" to automatically set the environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-s3-image-upload&project-name=aws-s3-image-upload&repository-name=aws-s3-image-upload&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,BUCKET_NAME)

**Option 2: Create an S3 bucket.**

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/aws-s3-image-upload
```

1. Create a new [IAM User](https://aws.amazon.com/iam/):
   1. Choose programatic access.
   2. Select "Attach existing policies directly"
   3. Add `AmazonS3FullAccess`.
1. Save the access key and secret key for the IAM User.
   1. This is used for programmatic access in the API Route.
1. Install the [AWS CLI](https://aws.amazon.com/cli/):
   1. Run `aws configure`.
   2. Enter your root AWS user access key and secret key.
   3. Enter your default region.
1. Create an `.env.local` file similar to `.env.example`.
   1. Enter your access key and secret key from the IAM user.
1. You must configure cors, for the upload to work
   1. [S3 Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-photo-album.html)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:DeleteObject",
           "s3:GetObject",
           "s3:ListBucket",
           "s3:PutObject",
           "s3:PutObjectAcl"
         ],
         "Resource": ["arn:aws:s3:::BUCKET_NAME", "arn:aws:s3:::BUCKET_NAME/*"]
       }
     ]
   }
   ```
1. Run `cdk bootstrap`.
1. Run `cdk deploy` to create an S3 bucket with an IAM policy.
1. Visit your newly created S3 bucket and retrieve the name and region.
1. Add the name and region to `.env.local`.
1. Run `pnpm dev` to start the Next.js app at http://localhost:3000.
1. Choose a `.png` or `.jpg` file.
1. You should see your file successfully uploaded to S3.

This example uses [`createPresignedPost`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property) instead of [`getSignedUrlPromise`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrlPromise-property) to allow setting max/min file sizes with `content-length-range`.

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

## Commands

- `pnpm dev` – Starts the Next.js app at `localhost:3000`.
- `cdk deploy` – Deploy this stack to your default AWS account/region
- `cdk diff` – Compare deployed stack with current state
- `cdk synth` – Emits the synthesized CloudFormation template
