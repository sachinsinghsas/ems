import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const backendURL = "http://localhost:3000/";

export const fetchEmployees = createAsyncThunk(
    "fetch/employees",
    async (_, { getState }) => {
        const state = getState();
        try {
            const response = await axios.get(`${backendURL}api/employees`, {
                headers: {
                    "Authorization": `Bearer ${state.authSlice.token}`,
                    "Content-Type": "application/json/sachin",
                },
            });
           
            return response.data;
        } catch (error: any) {
            console.log(error.response.data.message);
            throw error.response.data.message;
            
        }
    }
);
