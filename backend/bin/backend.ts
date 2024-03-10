#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { BackendStack } from "../lib/backend-ui-stack";
import { userInfo } from "os";
import { getCurrentGitBranch } from "../utils/git-util";

const app = new App();
const BackendStackUi = new BackendStack(
  app,
  `${userInfo().username}${getCurrentGitBranch()}BackendStack`,
  {
    env: {
      region: "us-east-1",
    },
  }
);

BackendStackUi.init();
