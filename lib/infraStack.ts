import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, stageName: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const lambdaFunction = new Function(this, 'LambdaFunction', {
        runtime: Runtime.NODEJS_16_X,
        handler: 'handler.handler',
        code: Code.fromAsset(path.join(__dirname, 'lambda')), //resolving to ./lambda directory
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