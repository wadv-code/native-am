import type { GetItem } from "@/api";
import { GetDetail, GetItems, GetMusic } from "@/api/api";
import { getSortOrderItems } from "@/utils/common";
import { formatPath, isAudioFile } from "@/utils/lib";
import { getStorageAsync, handleRawUrlItems } from "@/utils/store";
import type { AVPlaybackSource } from "expo-av";

export * from "./AudioBar";

export const onSwitchAudio = async (
  audioInfo: GetItem,
  gate: 1 | -1,
  isMusic: boolean = false
) => {
  if (isMusic) {
    const { info } = await GetMusic();
    return {
      id: info.id.toString(),
      name: info.name,
      auther: info.auther,
      raw_url: info.url,
      cover: info.pic_url,
    };
  } else if (audioInfo.parent) {
    try {
      const { data } = await GetItems({
        page: 1,
        password: "asmrgay",
        path: audioInfo.parent,
        per_page: 1000,
        refresh: false,
      });
      const audioItems = data.content.filter((f) => isAudioFile(f.name));
      const items = await getSortOrderItems(audioItems, {
        sort: "ascending",
        order: "name",
      });
      const index = items.findIndex((f) => f.id === audioInfo.id);
      if (index !== -1) {
        const audio = audioItems[index + gate];
        return audio;
      } else {
        return undefined;
      }
    } catch {
      return undefined;
    }
  }
};

type GetAudioRawUrlProps = {
  parent?: string;
  name?: string;
  raw_url?: string;
};

export const GetAudioSource = async ({
  parent,
  name,
  raw_url,
}: GetAudioRawUrlProps): Promise<AVPlaybackSource | undefined> => {
  try {
    if (raw_url) {
      return { uri: raw_url };
    }
    const path = formatPath(parent ?? "/", name ?? "/");
    const { rawUrlItems } = await getStorageAsync();
    const raw = rawUrlItems.find((f) => f.key === path);
    if (raw) {
      return { uri: raw.value };
    } else {
      const { data } = await GetDetail({
        password: "asmrgay",
        path,
      });
      if (data && data.raw_url) {
        handleRawUrlItems({ key: path, value: data.raw_url });
        return { uri: data.raw_url };
      } else return undefined;
    }
  } catch {
    return Promise.resolve(undefined);
  }
};
