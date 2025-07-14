import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { domain_name } from "@/utils/domain_name";


interface Employee {
    id: number,
    name: string,
    email: string,
    designation: string,
    salary: number
}

export const fetchEmployees = createAsyncThunk('fetchAll/employees',
    async (_, { rejectWithValue }) => {

        try {
            const response = await axios.get(`${domain_name}/api/employees`, {
                withCredentials: true
            });
           
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createEmployee = createAsyncThunk('create/employee', async (employee: Employee, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${domain_name}/api/employee`, employee, {
            withCredentials: true
        })

        return response.data;
    } catch (error: any) {
        console.log('error', error)
        return rejectWithValue(error.response.data);
    }

});

export const fetchEmployee = createAsyncThunk('fetch/employee', async (id: number, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${domain_name}/api/employee/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        console.log('error', error)
        return rejectWithValue(error.response.data);
    }

});


export const updateEmployee = createAsyncThunk('update/employee', async (employee: Employee, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${domain_name}/api/employee/${employee.id}`, employee, {
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        console.log('error', error)
        return rejectWithValue(error.response.data);
    }

});

export const logoutEmployee =  createAsyncThunk('logout/employee', async (_, { rejectWithValue }) => {
    try {

    await axios.post(`${domain_name}/api/logout`, {}, {
      withCredentials: true,
    });
  
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }

});

