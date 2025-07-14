import { createSlice } from "@reduxjs/toolkit";
import { createEmployee, fetchEmployee, fetchEmployees, logoutEmployee, updateEmployee } from "./action";
import type { AppDispatch, RootState } from "./store";
import { useDispatch } from "react-redux";
import type { PayloadAction } from '@reduxjs/toolkit'


export interface AuthState {
  info: string | null;
  employeeInfo: string[] | null;
  employeesInfo: string[] | null;
  token: string | null;
  loading: boolean | null;
  error: string | null;
}

const initialState: AuthState = {
  info: null,
  employeeInfo: [],
  employeesInfo: [],
  token: null,
  loading: null,
  error: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.info = action.payload.info;
    },
    // logoutEmployee: (state) => {
    //   console.log('logut clicke')
    //   state.info = null;
    //   state.employeeInfo = null;
    //   state.employeesInfo = null;
    //   state.error = null;
    //   state.loading = false;
    // },
  },
  extraReducers: (builder) => {
    // Fetch all employees
    builder
       .addCase(fetchEmployees.pending, (state, action) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchEmployees.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action?.payload?.data?.message ?? 'Something went wrong';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeesInfo = action.payload.data;
        state.error = null;
      })

      // Create a new employee
      .addCase(createEmployee.pending, (state, action) => {
      state.loading = true;
      state.error = null; 
      })
      .addCase(createEmployee.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action?.payload?.data?.message ?? 'Something went wrong';
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeInfo = action.payload.data;
        state.error = null;
      })
      
      //fetch an employee's detail
      .addCase(fetchEmployee.pending, (state, action) => {
      state.loading = true;
      state.error = null; 
      })
      .addCase(fetchEmployee.rejected,(state, action: any) => {
        state.loading = false;
        state.error = action?.payload?.data?.message ?? 'Something went wrong';
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeInfo = action.payload.data;
        state.error = null;
      })

      //update an employee
       .addCase(updateEmployee.pending, (state, action) => {
      state.loading = true;
      state.error = null; 
      })
      .addCase(updateEmployee.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action?.payload?.data?.message ?? 'Something went wrong';
      })
       .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeInfo = action.payload.data;
        state.error = null;
      })

      //logout
       .addCase(logoutEmployee.fulfilled, (state, action) => {
        console.log('done')
       state.info = null;
      state.employeeInfo = null;
      state.employeesInfo = null;
      state.error = null;
      state.loading = false;
      })
  },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const selectAuth = (state: RootState) => state.authSlice;

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
