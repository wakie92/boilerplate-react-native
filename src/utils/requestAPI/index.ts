/* eslint-disable no-console */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import qs from 'qs';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import { cloneDeep } from 'lodash-es';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

import constants from '../constants';
import urls from '../urls';
import Emitter from '../emitter';
import localeErrorMsg from 'src/locale/localeErrorMsg';

export const authenticationFailed = 'AuthenticationFailed';
export const clientTokenStorageId = 'clientTokens';
export const temporaryTokenStorageId = 'clientTemporaryTokens';

export const getIsReviewer = (email: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  } else {
    if (email.includes('@plutusds.com')) {
      return true;
    }
    return false;
  }
};

const getUserAgent = async () => {
  const userAgent = await DeviceInfo.getUserAgent();
  const appVersion = DeviceInfo.getVersion();
  const platform = Platform.OS;
  const uniqueDeviceId = DeviceInfo.getUniqueId();
  return `${userAgent} HanbitcoApp_${uniqueDeviceId}_${platform}_${appVersion}`;
};

export const getAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  return accessToken;
};

const { API, ENVIRONMENT } = constants;
const { auth } = urls.api;
const isNotProduction: boolean = ENVIRONMENT !== 'PRODUCTION';

const timeout: number = parseInt(constants.API.timeout, 10);

// eslint-disable-next-line no-secrets/no-secrets
// Todo: AxiosRequestConfig<any> 대신 제네릭으로 주입하는 방법
const requestAPI: AxiosInstance = axios.create({
  baseURL: `${API.host}/api/${API.host}`,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  timeout,
});

export const requestGetAPI = <T, D>(config?: AxiosRequestConfig<D>) =>
  requestAPI.get<T, AxiosResponse<T>, D>(config.url, config);

export const requestPostAPI = <T, D>(config?: AxiosRequestConfig<D>) =>
  requestAPI.post<T, AxiosResponse<T>, D>(config.url, config.data, config);

export const requestPutAPI = <T, D>(config?: AxiosRequestConfig<D>) =>
  requestAPI.put<T, AxiosResponse<T>, D>(config.url, config.data, config);

export const requestDeleteAPI = <T, D>(config?: AxiosRequestConfig<D>) =>
  requestAPI.delete<T, AxiosResponse<T>, D>(config.url, config);

export const requestPatchAPI = <T, D>(config?: AxiosRequestConfig<D>) =>
  requestAPI.patch<T, AxiosResponse<T>, D>(config.url, config.data, config);

axiosRetry(axios, { retryDelay: exponentialDelay });
// Request interceptor
requestAPI.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const configReq = cloneDeep(config);
      const userAgent = await getUserAgent();
      configReq.headers['User-Agent'] = userAgent;

      if (config.useFormData) {
        configReq.headers['Content-Type'] = 'multipart/form-data';
      }

      if (isNotProduction) {
        console.log('requestAPI - interceptors.req sent config: ', configReq);
      }

      return configReq;
    } catch (error) {
      console.error(`requestAPI - interceptors.req config: ${config} - error: ${error}`);
      return config;
    }
  },
  error => {
    console.error('requestAPI - interceptors.req error: ', error);

    return Promise.reject(error);
  },
);

// Response interceptor
requestAPI.interceptors.response.use(
  async (res: AxiosResponse) => {
    try {
      if (isNotProduction) {
        console.log('requestAPI - interceptors.res sent res: ', res);
      }

      const copiedRes = cloneDeep(res);
      const { config, data } = copiedRes;

      if (auth.login === config.url) {
        if (!data.is_pincode_set || data.is_migrated) {
          copiedRes.unverifiedUser = true;
        }
      }

      return copiedRes;
    } catch (error) {
      console.error(`requestAPI - interceptors.res res: ${res} - error: ${error}`);
      return res;
    }
  },
  async error => {
    if (isNotProduction) {
      console.error('requestAPI - interceptors.res error: ', { error });
    }
    const errorMsgList = localeErrorMsg;
    let errorMsg = localeErrorMsg.default;

    const { response, config } = error;
    const { data } = response;
    try {
      if (response) {
        if (response.status === 408 || error.code === 'ECONNABORTED') {
          errorMsg = errorMsgList.timeout;
        } else if (data.error_code && data?.error_class === authenticationFailed) {
          Emitter.emit(authenticationFailed);
        } else if (data.error_code && errorMsgList[`${data.error_class}_${data.error_code}`]) {
          errorMsg = errorMsgList[`${data.error_class}_${data.error_code}`];
        } else if (data.error_code && !errorMsgList[`${data.error_class}_${data.error_code}`]) {
          errorMsg = `${errorMsg} -> 에러코드: ${data.error_class}(${data.error_code})`;
        }
      }
    } catch (e) {
      console.error(`requestAPI - interceptors.res error: ${error} - e: ${e}`);
    }
    // [Note]: Reject with custom object to handle the error in higher catch
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      status: response ? response.status : 400,
      data: response ? response.data : {},
      config,
      errorMsg,
      error: error.message,
    });
  },
);

export default requestAPI;
