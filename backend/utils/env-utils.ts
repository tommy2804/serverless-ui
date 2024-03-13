export enum TOMMY_ENV {
  DEV = "dev",
  PROD = "prod",
}

const IZME_DOMAIN = {
  [TOMMY_ENV.DEV]: "tommy-development.online",
  [TOMMY_ENV.PROD]: "tommy-development.online",
};

const CERTIFICATES: any = {
  "izme.cloud": "d710ef0b-786f-4f58-8ef9-6bc2ab5241ea",
  "*.izme.cloud": "2291b92e-3c90-458d-9018-cf4da91c61e6",
  "izme.ai": "a7666a8e-a371-4630-b4ba-1a2124c85418",
  "*.izme.ai": "f6e205e1-64c5-4f8c-8980-ec8814861ef0",
};

export const getEnv = (): TOMMY_ENV => {
  const env = process.env.DEPLOY_ENV;
  if (env === TOMMY_ENV.DEV) return TOMMY_ENV.DEV;
  else if (env === TOMMY_ENV.PROD) return TOMMY_ENV.PROD;
  else throw new Error("Invalid environment");
};

export const isProd = (): boolean => getEnv() === TOMMY_ENV.PROD;

export const getDomainByEnv = (env: TOMMY_ENV): string => {
  return IZME_DOMAIN[env];
};

export const getCertificateArnByDomain = (domain: string): string => {
  const certificate = CERTIFICATES[domain];
  if (!certificate) throw new Error("Invalid domain");
  return certificate;
};
