import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { InfraStack } from './infraStack';

export class MyPipelineAppStage extends cdk.Stage {
    
    constructor(scope: Construct, stageName: string, props?: cdk.StageProps) {
      super(scope, stageName, props);
  
      const infraStack = new InfraStack(this, 'infraStack', stageName);      
    }
}