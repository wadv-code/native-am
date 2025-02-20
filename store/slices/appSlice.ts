import { getStorage, setStorage } from "@/storage/long";
import { INIT_APP } from "@/storage/storage-keys";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type AppState = {
  isImageBackground: boolean;
  isHttps: boolean;
  loading: boolean;
};

// 定义slice的初始状态
const initialState: AppState = {
  isImageBackground: true,
  isHttps: true,
  loading: false,
};

export const loadInitialApp = createAsyncThunk(
  "app/loadInitialApp",
  async () => {
    const info = JSON.parse(JSON.stringify(initialState));
    try {
      return await getStorage<AppState>(INIT_APP, info);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      return info;
    }
  }
);

const appSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setIsImageBackground(state, action) {
      state.isImageBackground = action.payload;
      setStorage(INIT_APP, state);
    },
    setIsHttps(state, action) {
      state.isHttps = action.payload;
      setStorage(INIT_APP, state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInitialApp.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadInitialApp.fulfilled, (state, action) => {
        if (action.payload) {
          state.isHttps = action.payload.isHttps;
          state.isImageBackground = action.payload.isImageBackground;
        }
        state.loading = false;
      })
      .addCase(loadInitialApp.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setIsHttps, setIsImageBackground } = appSlice.actions;

export default appSlice.reducer;
