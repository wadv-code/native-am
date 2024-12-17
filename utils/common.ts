import type { GetItemsResItem } from "@/api";
import { formatFileSize, formatPath, formatTimeAgo } from "./lib";
import { storageManager } from "@/storage";
import type { ActionSortOrder } from "@/types";
import dayjs from "dayjs";

/**
 * 格式化数据
 * @param items
 * @returns
 */
export async function formatContent(items: GetItemsResItem[], parent?: string) {
  const collectItems = await getCollectItems();
  items.forEach((item) => {
    item.parent = item.parent || parent || "/";
    const path = formatPath(item.parent, item.name);
    item.id = encodeURIComponent(path.replace(/\//g, ""));
    item.modifiedFormat = item.modified
      ? formatTimeAgo(item.modified)
      : undefined;
    item.sizeFormat = item.size ? formatFileSize(item.size) : undefined;
    item.is_collect = collectItems.some((s) => s.id === item.id);
  });
  return items;
}

/**
 * 切换收藏
 * @param item
 */
export const toggleCollect = async (item: GetItemsResItem) => {
  const collectItems = await getCollectItems();
  if (!collectItems.some((s) => s.id === item.id)) {
    item.is_collect = true;
    collectItems.push({ ...item });
  } else {
    const index = collectItems.findIndex((f) => f.id === item.id);
    if (index !== -1) {
      item.is_collect = false;
      collectItems.splice(index, 1);
    }
  }
  await saveCollectItems(collectItems);
  return item.is_collect;
};

export const getCollectItems = async () => {
  return (await storageManager.get<GetItemsResItem[]>("collect_items")) || [];
};

export const saveCollectItems = async (list: GetItemsResItem[]) => {
  return storageManager.set("collect_items", list);
};

export const getSortOrder = async (): Promise<ActionSortOrder> => {
  const sort = (await storageManager.get("sort_string")) ?? "descending";
  const order = (await storageManager.get("order_string")) ?? "time";
  return { sort, order };
};

export const getSortOrderItems = async (
  list: GetItemsResItem[],
  option?: ActionSortOrder
) => {
  const sortOrder = option ?? (await getSortOrder());
  list.sort((a, b) => {
    if (sortOrder.order === "time") {
      if (sortOrder.sort === "ascending") {
        return dayjs(a.modified).valueOf() - dayjs(b.modified).valueOf();
      } else {
        return dayjs(b.modified).valueOf() - dayjs(a.modified).valueOf();
      }
    } else if (sortOrder.order === "size") {
      if (sortOrder.sort === "ascending") {
        return (a.size || 0) - (b.size || 0);
      } else {
        return (b.size || 0) - (a.size || 0);
      }
    } else {
      if (sortOrder.sort === "ascending") {
        return a.name.localeCompare(b.name, "zh-CN");
      } else {
        return b.name.localeCompare(a.name, "zh-CN");
      }
    }
  });

  return [...list];
};
