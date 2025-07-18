import type { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
    name: string | null,
    token: string | null
}

const initialState: AuthState = {
    name: null,
    token: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
           
            localStorage.setItem("user",JSON.stringify({
                name: action.payload.name,
                token: action.payload.token
            }));
            state.name = action.payload.name;
            state.token = action.payload.token;
        }
    }
})

// export const selectAuth = (state: RootState) => state.auth;

// export const {setUser} = authSlice.actions;

// export default authSlice.reducer;