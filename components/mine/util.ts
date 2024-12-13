import { storageManager } from "@/storage";
import type { MaterialIconsName } from "@/types";
import type { Href } from "expo-router";

export type GridItem = {
  title: string;
  icon: MaterialIconsName;
  href?: Href;
  type?: string;
};

export const gridItems: GridItem[] = [
  { title: "浅色模式", icon: "light-mode", type: "theme" },
  { title: "清除缓存", icon: "delete-sweep", type: "clear" },
  { title: "愉悦心情", icon: "photo-library", href: "/views/viewer" },
  { title: "应用设置", icon: "settings", href: "/views/settings" },
  {
    title: "图片服务器",
    icon: "developer-board",
    href: "/views/image-server/image-server",
  },
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
      url: "https://3650000.xyz/api/",
      title: "3650000",
      params: [
        { key: "type", value: "json" },
        { key: "mode", value: "8" },
      ],
      isDefault: true,
    },
  ];
};

export type GetImageServerItemsFn = () => Promise<ServerItem[]>;
export type getImageServerDefaultItemFn = () => Promise<ServerItem | undefined>;

export const getImageServerItems: GetImageServerItemsFn = async () => {
  return (await storageManager.get("server_items")) || getServerItems();
};

export const getImageServerDefaultItem: getImageServerDefaultItemFn =
  async () => {
    const list = await getImageServerItems();
    return list.find((f) => f.isDefault);
  };
