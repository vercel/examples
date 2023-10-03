import * as iam from 'aws-cdk-lib/aws-iam'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class AwsS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'my-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.POST],
        },
      ],
    })

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [`${bucket.bucketArn}/*`],
      })
    )

    bucket.policy?.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:GetBucketTagging'],
        resources: [bucket.bucketArn],
      })
    )
  }
}
