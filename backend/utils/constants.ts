import { Runtime } from "aws-cdk-lib/aws-lambda";

export const staticFilesSuffix = [
  'svg',
  'js',
  'css',
  'json',
  'scss',
  'jpg',
  'jpeg',
  'png',
  'ico',
  'woff',
  'woff2',
  'ttf',
  'eot',
  'otf',
  'gif',
  'pdf',
];

export const runtime = Runtime.NODEJS_18_X