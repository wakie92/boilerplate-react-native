import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import { cloneDeep } from 'lodash-es';

import constants from '../constants';
import localeErrorMsg from 'src/locales/localeErrorMsg';

export const authenticationFailed = 'authentication_fail';
export const clientTokenStorageId = 'clientTokens';

export interface IErrorData {
  code: string;
  detail: { query: string[] };
  msg: string;
}

export type IErrorType = {
  status: number;
  data: IErrorData;
  errorMsg: string;
};
const isNotProduction: boolean = process.env.NEXT_PUBLIC_APP_ENV !== 'production';

const { API } = constants;
const timeout = parseInt(API.timeout as string, 10);

const requestAPI: AxiosInstance = axios.create({
  baseURL: `${API.host}api`,
  headers: { 'Content-Type': 'application/json' },
  timeout,
});

axiosRetry(axios, { retryDelay: exponentialDelay });
export const requestGetAPI = <T, D>(url: string, config: AxiosRequestConfig<D>) =>
  requestAPI.get<T, AxiosResponse<T>, D>(url as string, config);

export const requestPostAPI = <T, D>(url: string, config: AxiosRequestConfig<D>) =>
  requestAPI.post<T, AxiosResponse<T>, D>(url, config.data, config);

export const requestPutAPI = <T, D>(url: string, config: AxiosRequestConfig<D>) =>
  requestAPI.put<T, AxiosResponse<T>, D>(url, config.data, config);

export const requestDeleteAPI = <T, D>(url: string, config: AxiosRequestConfig<D>) =>
  requestAPI.delete<T, AxiosResponse<T>, D>(url, config);

export const requestPatchAPI = <T, D>(url: string, config: AxiosRequestConfig<D>) =>
  requestAPI.patch<T, AxiosResponse<T>, D>(url, config.data, config);

// Request interceptor
requestAPI.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      if (isNotProduction) {
        console.debug('requestAPI - interceptors.req sent config: ', config);
      }

      const configReq = cloneDeep(config);

      if (config.useFormData) {
        configReq.headers = {
          ['Content-Type']: 'multipart/form-data',
        };
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
        console.debug('requestAPI - interceptors.res sent res: ', res);
      }
      return res;
    } catch (error) {
      console.error(`requestAPI - interceptors.res res: ${res} - error: ${error}`);
      return res;
    }
  },
  async (error: AxiosError<{ code: string; detail: { query: string[] }; msg: string }>) => {
    if (isNotProduction) {
      console.debug('requestAPI - interceptors.res error: ', error && error.response);
    }

    const { response } = error;

    const errorMsgList = localeErrorMsg;

    let errorMsg = errorMsgList['errorMsg.default'];

    if (error.code === 'ERR_NETWORK') {
      // errorMsg = errorMsgList.errorMsg.networkError;
      return;
    }

    try {
      if (response && response.data) {
        const { code } = response.data;
        if (code && errorMsgList[`${code}`]) {
          errorMsg = errorMsgList[`${code}`];
        }
      }
    } catch (e) {
      console.error(`requestAPI - interceptors.res error: ${error} - e: ${e}`);
    }

    // [Note]: Reject with custom object to handle the error in higher catch
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      status: response ? response.status : 400,
      data: response?.data,
      errorMsg,
    });
  },
);

export default requestAPI;
