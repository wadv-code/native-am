/* eslint-disable */
import * as axios from "axios";

// 扩展 axios 数据返回类型，可自行扩展
declare module "axios" {
  export interface AxiosRequestConfig<D = any> {
    cache?: boolean; // 本地缓存
    refresh?: boolean; // 清理缓存重新请求
  }
  export interface AxiosResponse<T = any> {
    code: number;
    data: T;
    message: string;
    [key: string]: T;
  }
}
