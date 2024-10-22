// src/store/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import { persistStore, persistReducer } from "redux-persist"

import storage from "redux-persist/lib/storage" // d

// Import your reducers here
import authReducer from "./slices/auth/slice"

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistConfig = {
  key: "organization-panel",
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {counter: CounterState, ...}
export type AppDispatch = typeof store.dispatch

// Custom hooks for useDispatch and useSelector with types
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
