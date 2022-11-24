#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CicdTestStack } from '../lib/cicd_test-stack';

const app = new cdk.App();
new CicdTestStack(app, 'CicdTestStack', {
  env: {
    account: '450729639506',
    region: 'us-west-2',
  }
});

app.synth();