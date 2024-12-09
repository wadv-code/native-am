import request from "@/utils/request";
import type {
  GetItemsRes,
  GetDetailRes,
  GetItemsParams,
  GetCoverParams,
  GetDetailParams,
  GetSearchParams,
} from ".";
import { formatFileSize, formatTimeAgo } from "@/utils/lib";

/**
 * 获取列表
 * @constructor
 * @param params
 */
export async function GetItems(params: GetItemsParams, refresh?: boolean) {
  return request<GetItemsRes>({
    url: "/api/fs/list",
    method: "post",
    data: params,
    cache: true,
    refresh: refresh,
  }).then(({ data }) => {
    data.content.forEach((item) => {
      item.id = Math.random().toString();
      item.parent = item.parent || params.path || "/";
      // item.modified = dayjs(item.modified || Date.now()).format(
      //   "YYYY-MM-DD hh:ss"
      // );
      item.modifiedFormat = formatTimeAgo(item.modified);
      item.sizeFormat = formatFileSize(item.size);
    });
    return { data };
  });
}

/**
 * 获取文件详情
 * @constructor
 * @param data
 */
export async function GetDetail(data: GetDetailParams) {
  return request<GetDetailRes>({
    url: "/api/fs/get",
    method: "post",
    data,
  });
}

/**
 * 获取搜索目录/文件
 * @constructor
 * @param data
 */
export async function GetSearch(data: GetSearchParams) {
  return request<GetItemsRes>({
    url: "/api/fs/search",
    method: "post",
    data,
  });
}

/**
 * 获取封面
 * @constructor
 * @param params
 */
export async function GetCover(params: GetCoverParams) {
  return request<string>({
    url: "https://3650000.xyz/api/",
    method: "get",
    params: params,
  });
}
