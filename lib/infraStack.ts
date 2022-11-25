import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3'

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, stageName: string, props?: cdk.StackProps) {
      super(scope, id, props);

      const lambdaCodeBucket = s3.Bucket.fromBucketName(this, 'lambdaCodeBucket', 'github-to-lambda-s3-test')

      const lambdaFunction = new Function(this, 'LambdaFunction', {
        runtime: Runtime.PYTHON_3_9,
        handler: 'lambda_function.lambda_handler',
        code: Code.fromBucket(lambdaCodeBucket, 'deployment_package.zip'),
        environment: { "stageName": stageName } //inputting stagename
      });

      const api = new apigateway.RestApi(this, 'api', {
        description: 'example api gateway',
        deployOptions: {
          stageName: 'dev',
        },
        // 👇 enable CORS
        defaultCorsPreflightOptions: {
          allowHeaders: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
          ],
          allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          allowCredentials: true,
          allowOrigins: ['http://localhost:3000'],
        },
      });

      const todos = api.root.addResource('todos')

      todos.addMethod(
        'GET',
        new apigateway.LambdaIntegration(lambdaFunction, {proxy: true})
      )

    }
}