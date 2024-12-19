import type { GetDetailParams, GetItem } from "@/api";
import { GetCover, GetDetail } from "@/api/api";
import { getStorage, setStorage } from "@/storage/long";
import { IMAGE_DEFAULT_URL } from "@/utils";
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
  audioInfo: GetItem;
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

export const setAudioInfoAsync = createAsyncThunk<GetItem, GetItem>(
  "audio/setAudioInfoAsync",
  async (audio, thunkAPI) => {
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
        const url = await GetCover();
        if (url) {
          audio.cover = url;
          handleCoverItems({ key: params.path, value: url });
        }
      } catch (error) {
        thunkAPI.rejectWithValue(JSON.stringify(error));
      }
    }
    return audio;
  }
);

// 定义slice的初始状态
const initialState: AudioSlice = {
  loading: false,
  playing: false,
  duration: 0,
  current: 0,
  currentFormat: "00:00",
  durationFormat: "00:00",
  audioInfo: {
    id: "",
    name: "暂时没用可播放的音乐",
    auther: "",
    raw_url: "",
    cover: IMAGE_DEFAULT_URL,
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
      setStorage("audioInfo", action.payload);
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
        setStorage("audioInfo", action.payload);
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
