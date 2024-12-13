import request from "@/utils/request";
import type {
  GetItemsRes,
  GetDetailRes,
  GetItemsParams,
  GetDetailParams,
  GetSearchParams,
} from ".";
import { formatFileSize, formatTimeAgo } from "@/utils/lib";
import { getImageServerDefaultItem } from "@/components/mine/util";

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
export async function GetCover() {
  const item = await getImageServerDefaultItem();
  const param: Recordable<string> = { type: "json", mode: "8" };
  if (item) {
    item.params.forEach((v) => {
      param[v.key] = v.value;
    });
  }
  return request<string>({
    url: item ? item.url : "https://3650000.xyz/api/",
    method: "get",
    params: param,
  });
}
