import { getStorage, setStorage } from "@/storage/long";

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
  const viewerIndex = await getStorage<number>("viewerIndex", 0);
  // 源集
  const rawUrlItems = await getStorage<OptionType[]>("rawUrlItems", []);
  // 封面集
  const coverItems = await getStorage<OptionType[]>("coverItems", []);

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
    await setStorage("rawUrlItems", [...rawUrlItems]);
  } else {
    const list = [...rawUrlItems, { value, key }];
    await setStorage("rawUrlItems", list);
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
    setStorage("coverItems", list);
    return list;
  } else {
    const list = [...coverItems, { value, key }];
    setStorage("coverItems", list);
    return list;
  }
};
