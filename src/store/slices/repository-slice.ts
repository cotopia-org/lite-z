import { UserMinimalType } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

export type InitialStateType = {
  members: UserMinimalType[];
};

const initialState: InitialStateType = {
  members: [],
};

const repositorySlice = createSlice({
  name: "repository-slice",
  initialState: initialState,
  reducers: {},
});

export const {} = repositorySlice.actions;

export default repositorySlice.reducer;
