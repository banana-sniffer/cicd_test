// import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './stage'

export class CicdTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('banana-sniffer/cicd_test', 'main'), 
        commands: [
          'npm install',
          'npm ci',
          'npm run build', 
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk.out',
      })
    });

    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: { account: "450729639506", region: "us-west-2" }
    }));
  }
}