import type { GetItem } from "@/api";
import { GetItems, GetMusic } from "@/api/api";
import { getSortOrderItems } from "@/utils/common";
import { isAudioFile } from "@/utils/lib";

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
      console.log(items.map((v) => v.name));
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
