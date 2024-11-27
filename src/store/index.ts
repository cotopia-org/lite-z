import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";

import authSlice from "./slices/auth/slice";
import roomSlice from "./slices/room-slice";
import chatSlice from "./slices/chat-slice";
import settingSlice from "./slices/setting-slice";
import livekitSlice from "./slices/livekit-slice";

const rootReducer = combineReducers({
  auth: authSlice,
  room: roomSlice,
  chat: chatSlice,
  setting: settingSlice,
  livekit: livekitSlice,
});

const persistConfig = {
  key: "organization-panel",
  storage,
  whitelist: ["auth", "livekit"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {counter: CounterState, ...}
export type AppDispatch = typeof store.dispatch;

// Custom hooks for useDispatch and useSelector with types
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
