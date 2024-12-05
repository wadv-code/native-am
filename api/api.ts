import request from "@/utils/request";
import type {
  GetItemsRes,
  GetDetailRes,
  GetItemsParams,
  GetCoverParams,
  GetDetailParams,
} from ".";
/**
 * 系统基础
 */
export function useBaseApi() {
  return {
    /**
     * 获取列表
     * @constructor
     * @param params
     */
    GetItems: async (params: GetItemsParams, refresh?: boolean) => {
      return request<GetItemsRes>({
        url: "https://www.asmrgay.com/api/fs/list",
        method: "get",
        params: params,
        cache: true,
        refresh: refresh,
      });
    },
    /**
     * 获取文件详情
     * @constructor
     * @param params
     */
    GetDetail: async (params: GetDetailParams) => {
      return request<GetDetailRes>({
        url: "https://www.asmrgay.com/api/fs/get",
        method: "get",
        params: params,
      });
    },
    /**
     * 获取封面
     * @constructor
     * @param params
     */
    GetCover: async (params: GetCoverParams) => {
      return request<string>({
        url: "https://3650000.xyz/api",
        method: "get",
        params: params,
      });
    },
  };
}
