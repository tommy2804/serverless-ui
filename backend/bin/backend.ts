#!/usr/bin/env node
import { App } from 'aws-cdk-lib';

import { userInfo } from 'os';
import { getCurrentGitBranch } from '../utils/git-util';
import { STS } from 'aws-sdk';
import { BackendStack } from '../lib/backend-stack';

const getAccountId = async (): Promise<string | undefined> => {
  const sts = new STS();
  const res = await sts.getCallerIdentity().promise();
  return res.Account;
};

const main = async () => {
  const app = new App();
  const accountId = await getAccountId();
  const tommyServerlessProject = new BackendStack(
    app,
    `${userInfo().username}${getCurrentGitBranch()}TommyServerlessUi`,
    {
      env: {
        region: 'us-east-1',
        account: accountId,
      },
    },
  );
  tommyServerlessProject.init();
};

main();
