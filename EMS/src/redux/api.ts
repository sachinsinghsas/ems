import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000"
    }),
    tagTypes: ["POSTS"],
    endpoints: (builder)=>({
        submitLogin: builder.mutation({
            query: (post) => ({
                url: "api/login",
                method: "POST",
                body: post,
                credentials: "include",
                mode: 'cors'
            }),
            invalidatesTags: ["POSTS"]
        })
}),
});

export const { useSubmitLoginMutation } = authApi;