import { CloudFrontRequestEvent } from "aws-lambda";

const fileSuffix = [
  "svg",
  "js",
  "css",
  "html",
  "json",
  "scss",
  "jpg",
  "jpeg",
  "png",
  "ico",
];

export const handler = async (event: CloudFrontRequestEvent) => {
  const request = event.Records[0].cf.request;
  try {
    if (!fileSuffix.some((suf) => request.uri.endsWith(`.${suf}`))) {
      request.uri = "/index.html";
    }
  } catch (err) {
    console.log(err);
  }
  return request;
};