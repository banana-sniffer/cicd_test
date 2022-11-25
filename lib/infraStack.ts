import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Function, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class InfraStack extends cdk.Stage {
    
    constructor(scope: Construct, stageName: string, props?: cdk.StackProps) {
      super(scope, stageName, props);

      const lambdaFunction = new Function(this, 'LambdaFunction', {
        runtime: Runtime.NODEJS_16_X,
        handler: 'handler.handler',
        // Need to modify the code portion so that it pulls from an s3 bucket
        code: Code.fromAsset(path.join(__dirname, 'lambda')),
        environment: { "stageName": stageName } //inputting stagename
      });
    }
}