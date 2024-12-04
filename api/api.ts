import request from "@/utils/request";

// 请求参数
export type GetItemsParams = {
  name?: string;
  page: number;
  password: string;
  path: string;
  per_page: number;
  refresh?: boolean;
  scrollName?: string;
};

export type GetItemsResItem = {
  id: string;
  name: string;
  raw_url?: string;
  parent?: string;
  created?: string;
  hash_info?: object | null;
  hashinfo?: string;
  is_dir?: boolean;
  modified?: string;
  sign?: string;
  size?: number;
  thumb?: string;
  type?: number;
  onPress?: (option: GetItemsResItem, index?: number) => void;
};

// 请求参数
export type GetItemsRes = {
  content: GetItemsResItem[];
  page: number;
  header: string;
  provider: string;
  readme: string;
  total: number;
  write: boolean;
};

export type GetDetailParams = {
  password?: string;
  path: string;
};

export type GetDetailRes = {
  raw_url: string;
};
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
        url: "/api/fs/list",
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
        url: "/api/fs/get",
        method: "get",
        params: params,
      });
    },
  };
}
