import { createSlice } from "@reduxjs/toolkit";

type AppState = {
  isImageBackground: boolean;
};

// 定义slice的初始状态
const initialState: AppState = {
  isImageBackground: true,
};

const appSlice = createSlice({
  name: "audio",
  initialState: initialState,
  reducers: {
    setIsImageBackground(state, action) {
      state.isImageBackground = action.payload;
    },
  },
});

export const { setIsImageBackground } = appSlice.actions;

export default appSlice.reducer;
