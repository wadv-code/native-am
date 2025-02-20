import type { GetItem } from "@/api";
import { formatFileSize, formatPath, formatTimeAgo } from "./lib";
import type { ActionOrder, ActionSort, ActionSortOrder } from "@/types";
import dayjs from "dayjs";
import { getStorage, setStorage } from "@/storage/long";
import {
  COLLECT_ITEMS,
  ORDER_STRING,
  SORT_STRING,
} from "@/storage/storage-keys";

/**
 * 格式化数据
 * @param items
 * @returns
 */
export async function formatContent(
  items: GetItem[],
  isRandomId: boolean,
  parent?: string
) {
  const collectItems = await getCollectItems();
  items.forEach((item) => {
    item.parent = item.parent || parent || "/";
    const path = formatPath(item.parent, item.name);
    if (isRandomId) {
      item.id = Math.random().toString();
    } else {
      item.id = encodeURIComponent(path.replace(/\//g, ""));
    }
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
export const toggleCollect = async (item: GetItem) => {
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
  return await getStorage<GetItem[]>(COLLECT_ITEMS, []);
};

export const saveCollectItems = async (list: GetItem[]) => {
  return setStorage(COLLECT_ITEMS, list);
};

export const getSortOrder = async (): Promise<ActionSortOrder> => {
  const sort = await getStorage<ActionSort>(SORT_STRING, "descending");
  const order = await getStorage<ActionOrder>(ORDER_STRING, "time");
  return { sort, order };
};

export const getSortOrderItems = async (
  list: GetItem[],
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
