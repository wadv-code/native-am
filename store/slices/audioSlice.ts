import type { GetDetailParams, GetItemsResItem } from "@/api";
import { GetCover, GetDetail } from "@/api/api";
import { storageManager } from "@/storage";
import { formatMilliseconds, formatPath } from "@/utils/lib";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";

export type AudioSlice = {
  loading: boolean;
  playing: boolean;
  duration: number;
  current: number;
  currentFormat: string;
  durationFormat: string;
  audioInfo: GetItemsResItem;
};

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
  const viewerIndex = await storageManager.get("viewer_index");
  // 源集
  const rawUrlItems = await storageManager.get("raw_url_items");
  // 封面集
  const coverItems = await storageManager.get("cover_items");

  return {
    coverItems: coverItems ?? [],
    rawUrlItems: rawUrlItems ?? [],
    viewerIndex: Number(viewerIndex) || 0,
  };
};

export const handleRawUrlItems = async ({ value, key }: OptionType) => {
  const { rawUrlItems } = await getStorageAsync();
  const rawUrl = rawUrlItems.find((f) => f.key === key);
  if (rawUrl) {
    rawUrl.value = value;
    await storageManager.set("raw_url_items", [...rawUrlItems]);
  } else {
    const list = [...rawUrlItems, { value, key }];
    await storageManager.set("raw_url_items", list);
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
    storageManager.set("cover_items", list);
    return list;
  } else {
    const list = [...coverItems, { value, key }];
    storageManager.set("cover_items", list);
    return list;
  }
};

export const setAudioInfoAsync = createAsyncThunk<
  GetItemsResItem,
  GetItemsResItem
>("audio/setAudioInfoAsync", async (audio, thunkAPI) => {
  const { coverItems, rawUrlItems } = await getStorageAsync();
  const params: GetDetailParams = {
    password: "",
    path: "",
  };
  params.path = formatPath(audio.parent || "/", audio.name);
  const coverItem = coverItems.find((f) => f.key === params.path);
  const rawUrlItem = rawUrlItems.find((f) => f.key === params.path);
  audio.raw_url = rawUrlItem ? rawUrlItem.value : "";
  if (!audio.raw_url) {
    try {
      const { data } = await GetDetail(params);
      audio.raw_url = data.raw_url;
      handleRawUrlItems({ key: params.path, value: data.raw_url });
    } catch (error) {
      // Alert.alert("请求音频错误", JSON.stringify(error));
      thunkAPI.rejectWithValue(JSON.stringify(error));
    }
  }
  audio.cover = coverItem ? coverItem.value : "";
  if (!audio.cover) {
    try {
      const data = await GetCover();
      if (data.url) {
        const uri = __DEV__ ? data.url : data.url.replace(/http:/g, "https:");
        audio.cover = uri;
        handleCoverItems({ key: params.path, value: uri });
      }
    } catch (error) {
      thunkAPI.rejectWithValue(JSON.stringify(error));
    }
  }
  return audio;
});

// 定义slice的初始状态
const initialState: AudioSlice = {
  loading: false,
  playing: false,
  duration: 0,
  current: 0,
  currentFormat: "00:00",
  durationFormat: "00:00",
  audioInfo: {
    id: "1",
    name: "还没有音乐可以播放",
    cover: "http://3650000.xyz/api/",
  },
};

const audioSlice = createSlice({
  name: "audio",
  initialState: initialState,
  reducers: {
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
      state.durationFormat = formatMilliseconds(action.payload);
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
      state.currentFormat = formatMilliseconds(action.payload);
    },
    setAudioInfo: (state, action) => {
      state.audioInfo = action.payload;
      storageManager.set("audio_info", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAudioInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(setAudioInfoAsync.fulfilled, (state, action) => {
        // state.loading = false;
        state.audioInfo = action.payload;
        storageManager.set("audio_info", action.payload);
      })
      .addCase(setAudioInfoAsync.rejected, (state, action) => {
        state.loading = false;
        console.log("rejected", action.error);
        Alert.alert("设置音频错误", JSON.stringify(action.error));
      });
  },
});

export const { setPlaying, setLoading, setDuration, setCurrent, setAudioInfo } =
  audioSlice.actions;

export default audioSlice.reducer;
