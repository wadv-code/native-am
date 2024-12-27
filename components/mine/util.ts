import { getStorage } from "@/storage/long";
import type { MaterialIconsName } from "@/types";
import { IMAGE_DEFAULT_URL } from "@/utils";
import type { Href } from "expo-router";

export type GridItem = {
  title: string;
  icon: MaterialIconsName;
  href?: Href;
  type?: string;
};

export const gridItems: GridItem[] = [
  { title: "浅色模式", icon: "light-mode", type: "theme" },
  { title: "清除全部缓存", icon: "delete-sweep", type: "clear" },
  { title: "清除请求缓存", icon: "delete-sweep", type: "catalogRes" },
  { title: "愉悦心情", icon: "photo-library", href: "/views/viewer" },
  { title: "应用设置", icon: "settings", href: "/views/settings" },
  {
    title: "图片服务器",
    icon: "developer-board",
    href: "/views/image-server/image-server",
  },
  { title: "热搜聚合", icon: "whatshot", href: "/views/hot" },
  { title: "测试弹窗", icon: "table-view", type: "modal" },
];

export type ServerItemParam = {
  key: string;
  value: string;
};

export type ServerItem = {
  id: string;
  title: string;
  url: string;
  params: ServerItemParam[];
  isDefault?: boolean;
};

export const getServerItems = (): ServerItem[] => {
  return [
    {
      id: "1",
      url: IMAGE_DEFAULT_URL,
      title: "3650000",
      params: [
        { key: "type", value: "json" },
        { key: "mode", value: "2,8" },
      ],
      isDefault: true,
    },
    {
      id: "2",
      url: "https://t.alcy.cc/ycy/",
      title: "alcy",
      params: [{ key: "json", value: "" }],
      isDefault: false,
    },
    {
      id: "3",
      url: "https://moe.jitsu.top/img/",
      title: "alcy",
      params: [
        { key: "sort", value: "r18" },
        { key: "type", value: "json" },
      ],
      isDefault: false,
    },
    {
      id: "4",
      url: "https://api.vvhan.com/api/wallpaper/pcGirl/",
      title: "vvhan电脑",
      params: [{ key: "type", value: "json" }],
      isDefault: false,
    },
    {
      id: "5",
      url: "https://api.vvhan.com/api/wallpaper/mobileGirl/",
      title: "vvhan手机",
      params: [{ key: "type", value: "json" }],
      isDefault: false,
    },
  ];
};

export type GetImageServerItemsFn = () => Promise<ServerItem[]>;
export type getImageServerDefaultItemFn = (
  id?: string
) => Promise<ServerItem | undefined>;

export const getImageServerItems: GetImageServerItemsFn = async () => {
  return await getStorage<ServerItem[]>("serverItems", getServerItems());
};

export const getImageServerDefaultItem: getImageServerDefaultItemFn = async (
  id?: string
) => {
  const list = await getImageServerItems();
  return list.find((f) => (id ? f.id === id : f.isDefault));
};
