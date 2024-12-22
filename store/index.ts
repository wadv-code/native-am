import { configureStore } from "@reduxjs/toolkit";
import audioSlice, { loadInitialAudio } from "./slices/audioSlice";
import appSlice from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    audio: audioSlice,
  },
});

// 在应用启动时调度初始化 thunk
store.dispatch(loadInitialAudio());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
