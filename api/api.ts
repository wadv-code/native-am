import request from "@/utils/request";
import type {
  GetItemsRes,
  GetDetailRes,
  GetItemsParams,
  GetCoverParams,
  GetDetailParams,
} from ".";

/**
 * 获取列表
 * @constructor
 * @param params
 */
export async function GetItems(params: GetItemsParams, refresh?: boolean) {
  return request<GetItemsRes>({
    url: "https://www.asmrgay.com/api/fs/list",
    method: "get",
    params: params,
    cache: true,
    refresh: refresh,
  });
}

/**
 * 获取文件详情
 * @constructor
 * @param params
 */
export async function GetDetail(params: GetDetailParams) {
  return request<GetDetailRes>({
    url: "https://www.asmrgay.com/api/fs/get",
    method: "get",
    params: params,
  });
}
/**
 * 获取封面
 * @constructor
 * @param params
 */
export async function GetCover(params: GetCoverParams) {
  return request<string>({
    url: "https://3650000.xyz/api",
    method: "get",
    params: params,
  });
}
