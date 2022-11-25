#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { InfraStack } from '../lib/infraStack'


const app = new cdk.App();

const pipeline = new CodePipeline(app, 'Pipeline', {
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



// Setup for the actual infrastructure stack

const infraStack = new InfraStack(app, 'test', {
  env: { account: "450729639506", region: "us-west-2" }
})
pipeline.addStage(infraStack)

app.synth();