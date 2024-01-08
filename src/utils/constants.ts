export default {
  NO_DATA: 'No Data',
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  ENVIRONMENT: process.env.ENVIRONMENT,
  API: {
    host: process.env.NEXT_PUBLIC_API_HOST,
    timeout: process.env.NEXT_PUBLIC_API_TIMEOUT,
    version: 'v1',
  },
};

export enum ErrorLevels {
  application = 'application',
  layout = 'layout',
}
