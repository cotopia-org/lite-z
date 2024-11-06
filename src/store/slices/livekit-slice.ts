import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type InitialStateType = {
  token?: string;
};

const initialState: InitialStateType = {
  token: undefined,
};

const livekitSlice = createSlice({
  name: "livekit-slice",
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = undefined;
    },
  },
});

export const { setToken, clearToken } = livekitSlice.actions;

export default livekitSlice.reducer;
