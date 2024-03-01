export enum TOMMY_ENV {
  DEV = 'dev',
  PROD = 'prod',
}

const IZME_DOMAIN = {
  [TOMMY_ENV.DEV]: 'izme.cloud',
  [TOMMY_ENV.PROD]: 'izme.ai',
};

export const getEnv = (): TOMMY_ENV => {
  const env = process.env.DEPLOY_ENV;
  if (env === TOMMY_ENV.DEV) return TOMMY_ENV.DEV;
  else if (env === TOMMY_ENV.PROD) return TOMMY_ENV.PROD;
  else throw new Error('Invalid environment');
};

export const isProd = (): boolean => getEnv() === TOMMY_ENV.PROD;
