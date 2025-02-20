import { getStorage, setStorage } from "@/storage/long";
import {
  COVER_ITEMS,
  RAW_URL_ITEMS,
  VIEWER_INDEX,
} from "@/storage/storage-keys";

export type OptionType = {
  key: string;
  value: string;
};

export type GetStorageAsync = {
  rawUrlItems: OptionType[];
  coverItems: OptionType[];
  viewerIndex: number;
};

export const getStorageAsync = async (): Promise<GetStorageAsync> => {
  const viewerIndex = await getStorage<number>(VIEWER_INDEX, 0);
  // 源集
  const rawUrlItems = await getStorage<OptionType[]>(RAW_URL_ITEMS, []);
  // 封面集
  const coverItems = await getStorage<OptionType[]>(COVER_ITEMS, []);

  return {
    coverItems,
    rawUrlItems,
    viewerIndex: Number(viewerIndex) || 0,
  };
};

export const handleRawUrlItems = async ({ value, key }: OptionType) => {
  const { rawUrlItems } = await getStorageAsync();
  const rawUrl = rawUrlItems.find((f) => f.key === key);
  if (rawUrl) {
    rawUrl.value = value;
    await setStorage(RAW_URL_ITEMS, [...rawUrlItems]);
  } else {
    const list = [...rawUrlItems, { value, key }];
    await setStorage(RAW_URL_ITEMS, list);
  }
};

export const handleCoverItems = async ({
  value,
  key,
}: OptionType): Promise<OptionType[]> => {
  const { coverItems } = await getStorageAsync();
  const cover = coverItems.find((f) => f.key === key);
  if (cover) {
    cover.value = value;
    const list = [...coverItems];
    setStorage(COVER_ITEMS, list);
    return list;
  } else {
    const list = [...coverItems, { value, key }];
    setStorage(COVER_ITEMS, list);
    return list;
  }
};
