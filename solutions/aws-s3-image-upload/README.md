---
name: AWS S3 Image Upload
slug: aws-s3-image-upload
description: Learn to use AWS S3 to upload images to your bucket.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/aws-s3-image-upload&project-name=aws-s3-image-upload&repository-name=aws-s3-image-upload&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,AWS_BUCKET_NAME
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

1. Create a new [S3 Bucket](https://console.aws.amazon.com/s3/).
   1. In Object Ownership, select "ACLs enabled" and "Bucket owner prefered"
   2. In Block Public Access settings for this bucket, uncheck "Block all public access".
1. Create a new [IAM User](https://aws.amazon.com/iam/).
   1. Select "Attach policies directly".
   2. Add `s3:DeleteObject`, `s3:GetObject`, `s3:ListBucket`, `s3:PutObject`, `s3:PutObjectAcl`
1. Save the access key and secret key for the IAM User.
   1. Select the newly created user (IAM > Users > "your-user") and navigate to "Security Credentials".
   2. Under "Access Keys", create a key and save this information. We will use this in the next step.
1. Create an `.env.local` file similar to `.env.example`.
   1. In your `env.local` file, use the information from your access key, along with the region and bucket name.
   1. Do not adjust the naming of the keys, only input your values. [This is to ensure S3 Client can read them as defaults](https://docs.aws.amazon.com/sdkref/latest/guide/settings-reference.html).
1. Configure CORS to enable uploads from your browser.
   1. Navigate to your bucket, and go to the "Permissions" tab.
   2. Scroll down to find "Cross-origin resource sharing (CORS)" and click "Edit" on the right side.
   3. Paste the following code below.
   ```
   [
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
   ]
   ```
1. Run `pnpm dev` or `npm run dev` to start the Next.js app at http://localhost:3000.
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
const client = new S3Client({ region: process.env.AWS_REGION });
```

[Source: AWS Environment Variable Default “Load Credential”](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html)

The SDK will pick up the credentials from the environment automatically.

## Commands

- `pnpm dev` or `npm run dev` – Starts the Next.js app at `localhost:3000`.

## Additional Resources

### AWS Environment Variables

- AWS Environment Variables: https://docs.aws.amazon.com/sdkref/latest/guide/settings-reference.html
- AWS Environment Variable Default “Load Credential”: https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html

### AWS SDK - Presigned Post

- How to use PresignedPost URLs (this example includes adding user id as metadata): https://advancedweb.hu/how-to-use-s3-post-signed-urls/
- AWS SDK v3 - S3Client Initalization (see Usage): https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
- AWS SDK - Generate a Presigned Post: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html#generate-a-presigned-post
- AWS S3 POST Policy - Condition Matching (only allow images): https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
- AWS ACL Permissions: https://stackoverflow.com/a/70550540/19416953
