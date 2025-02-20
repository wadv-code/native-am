import type { GetItem } from "@/api";
import { getStorage, setStorage } from "@/storage/long";
import { INIT_AUDIO_DATA } from "@/storage/storage-keys";
import { formatAudioPosition } from "@/utils/lib";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type AudioSlice = {
  covering: boolean;
  loading: boolean;
  playing: boolean;
  audioInfo: GetItem;
  seek?: number;
};

export const initialState: AudioSlice = {
  covering: false,
  loading: false,
  playing: false,
  seek: 0,
  audioInfo: {
    id: "",
    name: "暂时没用可播放的音乐",
    auther: "",
    raw_url: "",
    cover: "",
    progress: 0,
    duration: 0,
    position: 0,
    currentFormat: "00:00",
    durationFormat: "00:00",
  },
};

export const loadInitialAudio = createAsyncThunk(
  "audio/loadInitialAudio",
  async () => {
    const info = JSON.parse(JSON.stringify(initialState.audioInfo));
    try {
      return await getStorage(INIT_AUDIO_DATA, info);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      return info;
    }
  }
);

const audioSlice = createSlice({
  name: "audio",
  initialState: initialState,
  reducers: {
    setSeek(state, action) {
      state.seek = action.payload;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCovering: (state, action) => {
      state.covering = action.payload;
    },
    setAudioCover: (state, action) => {
      state.audioInfo.cover = action.payload;
      setStorage(INIT_AUDIO_DATA, state.audioInfo);
    },
    setPosition: (state, action) => {
      const position = action.payload.position;
      const duration = action.payload.duration;
      const option = formatAudioPosition(position, duration);
      const { progress, durationFormat, currentFormat } = option;
      state.audioInfo.progress = progress;
      state.audioInfo.position = position;
      state.audioInfo.duration = duration;
      state.audioInfo.durationFormat = durationFormat;
      state.audioInfo.currentFormat = currentFormat;
      setStorage(INIT_AUDIO_DATA, state.audioInfo);
    },
    setAudioInfo: (state, action) => {
      if (state.loading) return;
      if (!action.payload.duration) {
        action.payload.duration = 0;
        action.payload.position = 0;
        action.payload.durationFormat = "00:00";
        action.payload.currentFormat = "00:00";
        action.payload.cover = action.payload.cover || "";
      }
      state.audioInfo = action.payload;
      setStorage(INIT_AUDIO_DATA, state.audioInfo);
    },
  },
  extraReducers: (builder) => {
    // 获取缓存音乐数据
    builder
      .addCase(loadInitialAudio.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadInitialAudio.fulfilled, (state, action) => {
        if (action.payload) state.audioInfo = action.payload;
        state.loading = false;
      })
      .addCase(loadInitialAudio.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setSeek,
  setPlaying,
  setCovering,
  setLoading,
  setPosition,
  setAudioInfo,
  setAudioCover,
} = audioSlice.actions;

export default audioSlice.reducer;
