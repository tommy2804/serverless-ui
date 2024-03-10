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
  CloudFrontWebDistribution,
  CloudFrontAllowedCachedMethods,
  CloudFrontAllowedMethods,
  PriceClass,
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
// import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
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

    const s3CorsRule: CorsRule = {
      allowedMethods: [
        HttpMethods.GET,
        HttpMethods.HEAD,
        HttpMethods.POST,
        HttpMethods.PUT,
        HttpMethods.DELETE,
      ],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
      maxAge: 300,
    };

    const s3Bucket = new Bucket(this, "S3Bucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: RemovalPolicy.DESTROY,
      accessControl: BucketAccessControl.PRIVATE,
      cors: [s3CorsRule],
    });

    const bucket = new Bucket(this, "UiStaticAssets", {
      websiteIndexDocument: "index.html",
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: RemovalPolicy.DESTROY,
      cors: [s3CorsRule],
    });

    const appFolderPath = "../serverless-ui/dist";
    const appFolderabsolutePath = fs.realpathSync(appFolderPath);

    new BucketDeployment(this, "ProjectBucket", {
      sources: [Source.asset(appFolderabsolutePath)],
      destinationBucket: s3Bucket,
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
      runtime: Runtime.NODEJS_16_X,
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

    const [ProjectBackendOutputs] = await Promise.all([ProjectBackendOutputsPromise]);

    const serviceApiOutput = findOutputValueByKey(
      ProjectBackendOutputs as Outputs,
      "ServiceEndpointsEndpoint"
    );

    const fixServiceApiEndpoint = removeSuffixixFromString(serviceApiOutput, apiSuffix);

    const s3PhotosUrl = findOutputValueByKey(
      ProjectBackendOutputs as Outputs,
      "CreateEventConstructUrlForObject"
    );
    const fixS3PhotosUrl = removeSuffixixFromString(s3PhotosUrl, ["https://"]);
    const [s3PhotoOrigin, s3PhotoPath] = fixS3PhotosUrl.split("/");

    const s3OrganizationsAssetsUrl = findOutputValueByKey(
      ProjectBackendOutputs as Outputs,
      "OrganizationsAssetsBucketUrl"
    );
    const fixS3OrganizationsAssetsUrl = removeSuffixixFromString(s3OrganizationsAssetsUrl, [
      "https://",
    ]);
    const [s3OrganizationsAssetsOrigin, s3OrganizationsAssetsPath] =
      fixS3OrganizationsAssetsUrl.split("/");

    const cloudfrontSDK = new AWS.CloudFront({
      region: "us-east-1",
    });
    const [cachePoliciesResponse, originRequestPoliciesResponse, responseHeadersPolicyResponse] =
      await Promise.all([
        cloudfrontSDK.listCachePolicies().promise(),
        cloudfrontSDK.listOriginRequestPolicies().promise(),
        cloudfrontSDK.listResponseHeadersPolicies().promise(),
      ]);
    const cachePoliciesList = cachePoliciesResponse?.CachePolicyList?.Items;
    const existCachePolicyAssets = cachePoliciesList?.find(
      (policy) => policy?.CachePolicy?.CachePolicyConfig?.Name === "CachePolicyAssets"
    );
    const existCachePolicyService = cachePoliciesList?.find(
      (policy) => policy?.CachePolicy?.CachePolicyConfig?.Name === "CachePolicyService"
    );
    const existResponseHeadersPoliciesList =
      responseHeadersPolicyResponse?.ResponseHeadersPolicyList?.Items;
    const existDefaultResponseHeadersPolicy = existResponseHeadersPoliciesList?.find(
      (policy) =>
        policy?.ResponseHeadersPolicy?.ResponseHeadersPolicyConfig?.Name ===
        "ProjectDefaultResponseHeadersPolicy"
    );
    const existExtendedResponseHeadersPolicy = existResponseHeadersPoliciesList?.find(
      (policy) =>
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
        referrerPolicy: HeadersReferrerPolicy.NO_REFERRER,
        override: false,
      },
      contentSecurityPolicy: {
        contentSecurityPolicy: `default-src 'none'; script-src 'self' *.googletagmanager.com *.google-analytics.com 'unsafe-inline'; connect-src 'self' *.google-analytics.com *.s3.eu-central-1.amazonaws.com blob:; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' flagcdn.com blob: data:; object-src 'none'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'; frame-src direct.tranzila.com; font-src fonts.gstatic.com localhost:5173`,
        override: false,
      },
    };
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
            ],
          },
        })
      : getResponseHeadersPolicy(existExtendedResponseHeadersPolicy);
    //
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

    const additionalBehaviorS3Configs = (
      s3PhotoOrigin: string,
      s3PhotoPath: string
    ): BehaviorOptions => ({
      allowedMethods: AllowedMethods.ALLOW_ALL,
      origin: new origin.HttpOrigin(s3PhotoOrigin, {
        protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        originPath: `/${s3PhotoPath}/`,
      }),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cachePolicyAssets,
      originRequestPolicy: s3OriginRequestPolicyExist,
      responseHeadersPolicy,
    });

    const photosBehaviorConfig = additionalBehaviorS3Configs(s3PhotoOrigin, s3PhotoPath);
    const staticAssetsBehaviorConfig = {
      allowedMethods: AllowedMethods.ALLOW_ALL,
      origin: new origin.S3Origin(s3Bucket),
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
      "/auth/*": additionalBehaviorconfigs(fixServiceApiEndpoint),
      "/medium/*": photosBehaviorConfig,
      "/small/*": photosBehaviorConfig,
      "/organization-assets/*": additionalBehaviorS3Configs(
        s3OrganizationsAssetsOrigin,
        s3OrganizationsAssetsPath
      ),
      ...ststicAssetsBehavior,
    };

    const oai = new OriginAccessIdentity(this, "OAI");
    s3Bucket.grantReadWrite(oai);

    s3Bucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [
          new AnyPrincipal(),
          new CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId),
        ],
        actions: ["s3:GetObject"],
        resources: [s3Bucket.arnForObjects("*")],
      })
    );

    //   const backendCloudfront = new CloudFrontWebDistribution(this, 'BackendCF', {
    //     comment: 'Project Backend CloudFront',
    //     defaultRootObject: 'index.html',
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     originConfigs: [
    //         {
    //             s3OriginSource: {
    //                 s3BucketSource: s3Bucket,
    //                 originAccessIdentity: oai,
    //             },
    //             ...additionalBehaviorconfigs(fixServiceApiEndpoint),
    //             behaviors: [
    //                 {
    //                     isDefaultBehavior: true,
    //                     allowedMethods: CloudFrontAllowedMethods.GET_HEAD
    //                 },

    //                 {
    //                     pathPattern: '/api/*',

    //                     allowedMethods: CloudFrontAllowedMethods.ALL,
    //                     forwardedValues: {
    //                         queryString: true,
    //                         headers: ['Authorization'],
    //                         queryStringCacheKeys: ['authorization']

    //                     },
    //                     defaultTtl: Duration.seconds(0),
    //                 },
    //                 {
    //                     pathPattern: '/medium/*',
    //                     ...photosBehaviorConfig,
    //                 },
    //                 {
    //                     pathPattern: '/small/*',
    //                     ...photosBehaviorConfig,
    //                 },
    //                 {
    //                     pathPattern: '/organization-assets/*',
    //                     ...additionalBehaviorS3Configs(s3OrganizationsAssetsOrigin, s3OrganizationsAssetsPath),
    //                 },
    //                 ...Object.entries(ststicAssetsBehavior).map(([pathPattern, behavior]) => ({
    //                     pathPattern,

    //                 })),
    //             ]
    //         },
    //     ],
    //     errorConfigurations: [
    //         {
    //             errorCode: 404,
    //             responseCode: 200,
    //             responsePagePath: '/index.html',
    //         },
    //     ],
    // });

    // Update the distribution with additional configurations

    // const cfd = new Distribution(this, "ProjectDistribution", {
    //   defaultBehavior: {
    //     origin: new origin.S3Origin(s3Bucket),
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     cachePolicy: cachePolicyService,
    //     originRequestPolicy:
    //       s3OriginRequestPolicyExist ||
    //       new OriginRequestPolicy(this, "RequestPolicy", {
    //         cookieBehavior: CacheCookieBehavior.all(),
    //         originRequestPolicyName: "S3DeafaultOriginRequestPolicy",
    //       }),
    //     responseHeadersPolicy: ExtendedResponseHeadersPolicy,
    //   },
    //   errorResponses: [
    //     {
    //       httpStatus: 404,
    //       responsePagePath: "/index.html",
    //       responseHttpStatus: 200,
    //     },
    //   ],
    //   additionalBehaviors,
    //   defaultRootObject: "index.html",
    // });

    const cloudFrontDistribution = new CloudFrontWebDistribution(this, "MyCloudFrontDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3Bucket,
            originAccessIdentity: oai,
          },

          behaviors: [
            ExtendedResponseHeadersPolicy,
            // Default behavior
            {
              viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              allowedMethods: CloudFrontAllowedMethods.ALL, // Example, adjust as needed
              cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD, // Example, adjust as needed
              compress: true,
              isDefaultBehavior: true,
            },
            // Additional behaviors
            ...Object.entries(additionalBehaviors).map(([pathPattern, behavior]) => ({
              pathPattern,
              ...behavior,
              allowedMethods: CloudFrontAllowedMethods.ALL, // Example, adjust as needed
              cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD, // Example, adjust as needed
            })),
          ],
          // Additional configuration for the origin
        },
      ],

      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      errorConfigurations: [
        {
          errorCode: 402,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
      ],
      // Other configuration options
    });

    // Other configuration options

    new CfnOutput(this, "CloudFrontWebDomain", {
      value: cloudFrontDistribution.distributionDomainName,
    });

    new CfnOutput(this, "CloudFrontDistributionId", {
      value: cloudFrontDistribution.distributionId,
    });

    new CfnOutput(this, "S3BucketName", {
      value: s3Bucket.bucketWebsiteDomainName,
    });

    new CfnOutput(this, "S3BucketUrl", {
      value: s3Bucket.bucketWebsiteUrl,
    });

    // new CfnOutput(this, 'SecondOne', {
    //   value: `https://${backendCloudfront.distributionDomainName}`,
    // });

    // new CfnOutput(this, 'SecondTwo', {
    //   value: backendCloudfront.distributionId,
    // });
  }
}
