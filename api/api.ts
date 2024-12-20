import request from "@/utils/request";
import { IMAGE_DEFAULT_URL } from "@/utils";
import { findAllUrls } from "@/utils/lib";
import { formatContent } from "@/utils/common";
import {
  getImageServerDefaultItem,
  type ServerItem,
} from "@/components/mine/util";
import type {
  GetItemsRes,
  GetDetailRes,
  GetItemsParams,
  GetDetailParams,
  GetSearchParams,
} from ".";

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
  }).then(async (res) => {
    await formatContent(res.data.content, params.path);
    return res;
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
  }).then(async (res) => {
    await formatContent(res.data.content);
    return res;
  });
}

/**
 * 获取封面
 * @constructor
 * @param params
 */
export async function GetCover(item?: ServerItem): Promise<string> {
  const row = item || (await getImageServerDefaultItem());
  const param: Recordable<string> = {};
  if (row) {
    row.params.forEach((v) => {
      param[v.key] = v.value;
    });
  } else {
    param.type = "json";
    param.mode = "2,8";
  }
  return request({
    url: row ? row.url : IMAGE_DEFAULT_URL,
    method: "get",
    params: param,
  }).then((res) => {
    const urls = findAllUrls(res);
    const url = urls.length ? urls[0] : IMAGE_DEFAULT_URL;
    const uri = __DEV__ ? url : url.replace(/http:/g, "https:");
    return uri;
  });
}

export type MusicRes = {
  id: number;
  name: string;
  auther: string;
  pic_url: string;
  url: string;
  update_time: string;
};

/**
 * 获取音乐
 * @constructor
 * @param params
 */
export async function GetMusic(bill: string = "热歌榜") {
  return request<MusicRes>({
    url: `https://api.vvhan.com/api/wyMusic/${bill}`,
    method: "get",
    params: {
      type: "json",
    },
  });
}

export type GetHotListItem = {
  hot: string;
  index: number;
  mobil_url: string;
  title: string;
  type: string;
  url: string;
};

export type GetHotListRes = {
  data: GetHotListItem[];
  name: string;
  subtitle: string;
  update_time: string;
}[];

/**
 * 获取热搜榜单聚合
 * @constructor
 */
export async function GetHotList(refresh?: boolean) {
  return request<GetHotListRes>({
    url: "https://api.vvhan.com/api/hotlist/all",
    method: "get",
    cache: true,
    refresh,
  });
}
