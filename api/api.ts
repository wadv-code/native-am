import request from "@/utils/request";

// 请求参数
export type GetItemsParams = {
  page: number;
  password: string;
  path: string;
  per_page: number;
  refresh?: boolean;
};

export type GetItemsResItem = {
  name: string;
  created?: string;
  hash_info?: object | null;
  hashinfo?: string;
  is_dir?: boolean;
  modified?: string;
  sign?: string;
  size?: number;
  thumb?: string;
  type?: number;
  onPress?: (option: GetItemsResItem) => void;
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
  };
}
