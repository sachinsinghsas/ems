import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api";
import { authSlice } from "./reducer"
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import { useDispatch } from "react-redux";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [authSlice.name]: persistedReducer
    },
    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware)
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export const useAppDispatch = () => useDispatch<AppDispatch>()

setupListeners(store.dispatch);




