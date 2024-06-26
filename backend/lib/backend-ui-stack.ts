import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Bucket, BucketAccessControl, CorsRule, HttpMethods } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  CachePolicy,
  CacheCookieBehavior,
  OriginRequestPolicy,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseHeadersPolicy,
  BehaviorOptions,
  AllowedMethods,
  ViewerProtocolPolicy,
  LambdaEdgeEventType,
  Distribution,
  OriginProtocolPolicy,
  CacheQueryStringBehavior,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import {
  Role,
  ServicePrincipal,
  PolicyStatement,
  AnyPrincipal,
  ManagedPolicy,
  CompositePrincipal,
  Effect,
  CanonicalUserPrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as fs from "fs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as AWS from "aws-sdk";
import { Outputs } from "aws-sdk/clients/cloudformation";
import { BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import * as origin from "aws-cdk-lib/aws-cloudfront-origins";
import { staticFilesSuffix } from "../utils/constants";
import { getCurrentGitBranch } from "../utils/git-util";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
  async init() {
    this.createServlessProjectUiStack().catch(console.error);
  }

  private async createServlessProjectUiStack() {
    const stack = Stack.of(this);
    const branch = getCurrentGitBranch().toLowerCase();
    const fixedBranch = branch.includes("pr") ? branch.replace("pr", "") : branch;
    const isMaster = branch === "master";

    const bucket = new Bucket(this, "UiAssets", {
      websiteIndexDocument: "index.html",
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    bucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new AnyPrincipal()],
        actions: ["s3:GetObject"],
        resources: [bucket.bucketArn + "/*"],
      })
    );

    const appFolderPath = "../serverless-ui/dist";
    const appFolderabsolutePath = fs.realpathSync(appFolderPath);

    new BucketDeployment(this, "ProjectBucket", {
      sources: [Source.asset(appFolderabsolutePath)],
      destinationBucket: bucket,
      retainOnDelete: false,
      destinationKeyPrefix: "/",
    });

    const edgeLambdaRole = new Role(this, "EdgeLambdaRole", {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal("lambda.amazonaws.com"),
        new ServicePrincipal("edgelambda.amazonaws.com")
      ),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
      ],
    });

    const apiOriginRequestLambda: NodejsFunction = new NodejsFunction(this, "ApiOriginRequest", {
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(5),
      entry: "lib/lambdas/api-origin-request.ts",
      role: edgeLambdaRole,
    });

    const getBackendOutputs = async (
      stackName: string,
      region: string
    ): Promise<Outputs | undefined> => {
      const cloudFormation = new AWS.CloudFormation({ region });
      const stackOutputs = await cloudFormation.describeStacks({ StackName: stackName }).promise();
      return stackOutputs?.["Stacks"]?.[0]["Outputs"];
    };

    const findOutputValueByKey = (outputs: Outputs, key: string): string => {
      return outputs.find((output: any) => output.OutputKey?.includes(key))?.OutputValue || "";
    };

    const removeSuffixixFromString = (str: string, suffix: string[]): string => {
      return suffix.reduce((acc, cur) => acc.replace(cur, ""), str);
    };

    const apiSuffix = ["https://", "/prod/"];
    const ProjectBackendOutputsPromise = getBackendOutputs(
      "tommyrzMasterServerlessProjectStack",
      "eu-central-1"
    );

    const ProjectBackendOutputs = await ProjectBackendOutputsPromise;

    const serviceApiOutput = findOutputValueByKey(
      ProjectBackendOutputs as Outputs,
      "ServiceEndpoints"
    );

    const fixServiceApiEndpoint = removeSuffixixFromString(serviceApiOutput, apiSuffix);
    const cloudfrontSDK = new AWS.CloudFront();
    const [cachePoliciesResponse, originRequestPoliciesResponse, responseHeadersPolicyResponse] =
      await Promise.all([
        cloudfrontSDK.listCachePolicies().promise(),
        cloudfrontSDK.listOriginRequestPolicies().promise(),
        cloudfrontSDK.listResponseHeadersPolicies().promise(),
      ]);
    const cachePoliciesList = cachePoliciesResponse?.CachePolicyList?.Items;
    const existCachePolicyAssets = cachePoliciesList?.find(
      (policy: any) => policy?.CachePolicy?.CachePolicyConfig?.Name === "CachePolicyAssets"
    );
    const existCachePolicyService = cachePoliciesList?.find(
      (policy: any) => policy?.CachePolicy?.CachePolicyConfig?.Name === "CachePolicyService"
    );
    const existResponseHeadersPoliciesList =
      responseHeadersPolicyResponse?.ResponseHeadersPolicyList?.Items;
    const existDefaultResponseHeadersPolicy = existResponseHeadersPoliciesList?.find(
      (policy: any) =>
        policy?.ResponseHeadersPolicy?.ResponseHeadersPolicyConfig?.Name ===
        "ProjectDefaultResponseHeadersPolicy"
    );
    const existExtendedResponseHeadersPolicy = existResponseHeadersPoliciesList?.find(
      (policy: any) =>
        policy?.ResponseHeadersPolicy?.ResponseHeadersPolicyConfig?.Name ===
        "ProjectExtendedResponseHeadersPolicy"
    );

    const getExistCachePolicy = (cachePolicy: any) =>
      cachePolicy &&
      CachePolicy.fromCachePolicyId(
        this,
        cachePolicy.CachePolicy?.CachePolicyConfig?.Name,
        cachePolicy.CachePolicy.Id
      );

    const getResponseHeadersPolicy = (responseHeadersPolicy: any) =>
      responseHeadersPolicy &&
      ResponseHeadersPolicy.fromResponseHeadersPolicyId(
        this,
        responseHeadersPolicy.ResponseHeadersPolicy?.ResponseHeadersPolicyConfig?.Name,
        responseHeadersPolicy.ResponseHeadersPolicy.Id
      );

    const cachePolicyAssets =
      getExistCachePolicy(existCachePolicyAssets) ||
      new CachePolicy(this, "CachePolicyAssets", {
        cachePolicyName: "CachePolicyAssets",
        queryStringBehavior: CacheQueryStringBehavior.all(),
        defaultTtl: Duration.days(1),
        minTtl: Duration.seconds(1),
        maxTtl: Duration.days(365),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

    const cachePolicyService =
      getExistCachePolicy(existCachePolicyService) ||
      new CachePolicy(this, "CachePolicyService", {
        cachePolicyName: "CachePolicyService",
        cookieBehavior: CacheCookieBehavior.all(),
        queryStringBehavior: CacheQueryStringBehavior.all(),
        defaultTtl: Duration.seconds(0),
        maxTtl: Duration.hours(1),
      });

    const originRequestPoliciesList = originRequestPoliciesResponse?.OriginRequestPolicyList?.Items;
    const existS3OriginRequestPolicy = originRequestPoliciesList?.find(
      (policy) =>
        policy?.OriginRequestPolicy?.OriginRequestPolicyConfig?.Name ===
        "S3DeafaultOriginRequestPolicy"
    );
    const s3OriginRequestPolicyExist =
      existS3OriginRequestPolicy &&
      OriginRequestPolicy.fromOriginRequestPolicyId(
        this,
        existS3OriginRequestPolicy.OriginRequestPolicy?.OriginRequestPolicyConfig.Name,
        existS3OriginRequestPolicy.OriginRequestPolicy.Id
      );

    const apiGwRequestPolicy = OriginRequestPolicy.fromOriginRequestPolicyId(
      this,
      `AllViewerExceptHostHeader`,
      "b689b0a8-53d0-40ab-baf2-68738e2966ac"
    );
    const securityHeadersBehavior = {
      strictTransportSecurity: {
        accessControlMaxAge: Duration.seconds(31536000),
        includeSubdomains: true,
        preload: true,
        override: false,
      },
      contentTypeOptions: {
        override: false,
      },
      frameOptions: {
        frameOption: HeadersFrameOption.DENY,
        override: true,
      },
      xssProtection: {
        protection: true,
        modeBlock: true,
        override: false,
      },
      referrerPolicy: {
        referrerPolicy: HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
        override: false,
      },
      contentSecurityPolicy: {
        contentSecurityPolicy: `default-src 'none'; script-src 'self' *.googletagmanager.com *.google-analytics.com 'unsafe-inline'; connect-src 'self' *.google-analytics.com *.s3.eu-central-1.amazonaws.com blob:; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' flagcdn.com blob: data:; object-src 'none'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'; frame-src direct.tranzila.com; font-src fonts.gstatic.com`,
        override: false,
      },
    };

    const noIndexHeaderDev = [
      {
        header: "X-Robots-Tag",
        value: "noindex",
        override: false,
      },
    ];

    const responseHeadersPolicy = isMaster
      ? new ResponseHeadersPolicy(this, "ProjectDefaultResponseHeadersPolicy", {
          responseHeadersPolicyName: "ProjectDefaultResponseHeadersPolicy",
          securityHeadersBehavior,
        })
      : getResponseHeadersPolicy(existDefaultResponseHeadersPolicy);
    const ExtendedResponseHeadersPolicy = isMaster
      ? new ResponseHeadersPolicy(this, "ProjectExtendedResponseHeadersPolicy", {
          responseHeadersPolicyName: "ProjectExtendedResponseHeadersPolicy",
          securityHeadersBehavior,
          customHeadersBehavior: {
            customHeaders: [
              {
                header: "Cache-Control",
                value: "no-store",
                override: false,
              },
              ...noIndexHeaderDev,
            ],
          },
        })
      : getResponseHeadersPolicy(existExtendedResponseHeadersPolicy);

    const additionalBehaviorconfigs = (endpoint: string): BehaviorOptions => ({
      allowedMethods: AllowedMethods.ALLOW_ALL,
      origin: new origin.HttpOrigin(endpoint, {
        protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        originPath: "/prod",
      }),
      edgeLambdas: [
        {
          functionVersion: apiOriginRequestLambda.currentVersion,
          eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
        },
      ],
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cachePolicyService,
      originRequestPolicy: apiGwRequestPolicy,
      responseHeadersPolicy,
    });

    const staticAssetsBehaviorConfig = {
      allowedMethods: AllowedMethods.ALLOW_ALL,
      origin: new origin.S3Origin(bucket),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cachePolicyAssets,
      originRequestPolicy: s3OriginRequestPolicyExist,
      responseHeadersPolicy,
    };
    const ststicAssetsBehavior = staticFilesSuffix.reduce(
      (acc: any, cur: string) => {
        return {
          ...acc,
          [`/*.${cur}`]: staticAssetsBehaviorConfig,
        };
      },
      {} as Record<string, BehaviorOptions>
    );
    const additionalBehaviors: Record<string, BehaviorOptions> = {
      "/api/*": additionalBehaviorconfigs(fixServiceApiEndpoint),
      ...ststicAssetsBehavior,
    };

    const oai = new OriginAccessIdentity(this, "OAI");
    bucket.grantReadWrite(oai);

    const cfd = new Distribution(this, "ProjectDistribution", {
      defaultBehavior: {
        origin: new origin.S3Origin(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // cachePolicy: cachePolicyService,
        originRequestPolicy:
          s3OriginRequestPolicyExist ||
          new OriginRequestPolicy(this, "RequestPolicy", {
            cookieBehavior: CacheCookieBehavior.all(),
            originRequestPolicyName: "S3DeafaultOriginRequestPolicy",
          }),
        responseHeadersPolicy: ExtendedResponseHeadersPolicy,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responsePagePath: "/index.html",
          responseHttpStatus: 200,
        },
      ],
      additionalBehaviors,
      defaultRootObject: "index.html",
    });

    // Other configuration options

    new CfnOutput(this, "CloudFrontWebDomain", {
      value: cfd.distributionDomainName,
    });

    new CfnOutput(this, "CloudFrontDistributionId", {
      value: cfd.distributionId,
    });

    new CfnOutput(this, "S3BucketName", {
      value: bucket.bucketWebsiteDomainName,
    });

    new CfnOutput(this, "S3BucketUrl", {
      value: bucket.bucketWebsiteUrl,
    });

    // new CfnOutput(this, 'SecondOne', {
    //   value: `https://${backendCloudfront.distributionDomainName}`,
    // });

    // new CfnOutput(this, 'SecondTwo', {
    //   value: backendCloudfront.distributionId,
    // });
  }
}