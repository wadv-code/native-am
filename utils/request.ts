import { storageManager } from "@/storage";
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * 生成key
 * @param config
 */
const generateCacheKey = (config: AxiosRequestConfig) => {
  const { url, data, params } = config;
  let param = {};
  if (params) {
    param = params;
  } else if (data) {
    param = JSON.parse(data);
  }
  // 查询参数排序
  const sortedParams = sortParams(param);
  // 查询参数序列化
  const serializedParams = serializeParams(sortedParams);
  return `${url}${serializedParams}`;
};

/**
 * 排序参数
 * @param params
 */
const sortParams = (params: Recordable<any>) => {
  return Object.keys(params)
    .sort()
    .reduce((sorted: Recordable<any>, key) => {
      sorted[key] = params[key];
      return sorted;
    }, {});
};

/**
 * 序列化参数
 * @param params
 */
const serializeParams = (params: Recordable<any>) => {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
};

/**
 * 自定义缓存
 * @param config
 */
const cacheAdapter = async (config: AxiosRequestConfig) => {
  const cacheAge = config.cache;
  if (cacheAge) {
    const cacheKey = generateCacheKey(config);

    const cacheRes = await storageManager.get(cacheKey);
    if (cacheRes) {
      return Promise.resolve(cacheRes);
    } else {
      delete config.adapter;
      const res = await axios(config);
      if (res.data && res.data.data) {
        // 保存数据
        await storageManager.set(cacheKey, res);
      }
      return res;
    }
  } else {
    delete config.adapter;
    return axios(config);
  }
};

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
  adapter: cacheAdapter,
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "https://www.asmrgay.com",
  timeout: 50000,
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // // 在发送请求之前做些什么 token
    // if (token.value) config.headers![TokenKey] = `Bearer ${token.value}`
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  async (response) => {
    // 对响应数据做点什么
    const res = response.data;
    if (res.code === 200) {
      // `token` 过期或者账号已在别处登录
      // if (res.code === 401 || res.code === 4001) {
      //     Session.clear() // 清除浏览器全部临时缓存
      //     window.location.href = '/' // 去登录页
      //     ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
      //         .then(() => { })
      //         .catch(() => { })
      // } else {
      //     ElMessage.warning(res.msg || '服务器错误')
      // }
      return res;
    } else {
      return Promise.reject(service.interceptors.response);
    }
  },
  (error) => {
    // console.log('error', error)
    // 对响应错误做点什么
    if (error.response.status === 401) {
      // Session.clear() // 清除浏览器全部临时缓存
      window.location.href = "/"; // 去登录页
    } else if (error.message.indexOf("timeout") != -1) {
      // ElMessage.error('网络超时')
    } else if (error.message == "Network Error") {
      // ElMessage.error('网络连接错误')
    } else {
      // if (error.response.data) ElMessage.error(error.response.statusText)
      // else ElMessage.error('接口路径找不到')
    }
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
