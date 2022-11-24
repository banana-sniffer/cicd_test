// import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

export class CicdTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('banana-sniffer/cicd_test', 'main'), //Remember to change 
        commands: [
          // 'pwd',
          // 'ls',
          // 'npm -v',
          'npm install',
          'npm ci',
          'npm run build', 
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk.out',
      })
    });
  }
}