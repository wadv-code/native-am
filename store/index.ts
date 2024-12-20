import { configureStore } from "@reduxjs/toolkit";
import audioSlice from "./slices/audioSlice";
import appSlice from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    audio: audioSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
