import { createSlice } from "@reduxjs/toolkit";
import { fetchEmployees } from "./action";
import type { RootState } from "./store";


//get token from local storage
// const userToken: string | null = localStorage.getItem("user")
//   ? localStorage.getItem("user")
//   : null;

export interface AuthState {
  info: string | null;
  employeeInfo: string | null;
  token: string | null;
  loading: boolean | null;
  error: any | null;
}

const initialState: AuthState = {
  info: null,
  employeeInfo: null,
  token: null,
  loading: null,
  error: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          info: action.payload.employeeInfo,
          token: action.payload.token,
        })
      );
      state.info = action.payload.info;
      state.token = action.payload.token;
    },
    logout: (state) => {
      localStorage.removeItem("user"); //delete token from storage
      state.info = null;
      state.token = null;
      state.employeeInfo = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeInfo = action.payload.data;
        state.error = null;
      })
      .addCase(fetchEmployees.pending, (state, action) => {
        state.loading = true;
        state.error = "pending";
        
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
  
        state.loading = true;
        state.error = action.error.message;
      });
  },
});


export const selectAuth = (state: RootState) => state.authSlice;

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
