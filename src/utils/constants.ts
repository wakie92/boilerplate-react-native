import ENV from 'react-native-config';

export default {
  NO_DATA: 'No Data',
  DOMAIN: ENV.APP_PUBLIC_DOMAIN as string,
  ENVIRONMENT: ENV.APP_ENVIRONMENT as string,

  API: {
    host: ENV.APP_PUBLIC_API_HOST as string,
    timeout: ENV.APP_PUBLIC_API_TIMEOUT as string,
    version: ENV.APP_PUBLIC_API_TIMEOUT as string,
  },
};

export enum ErrorLevels {
  application = 'application',
  layout = 'layout',
}
