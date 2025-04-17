import { apiSlice } from "../api/apiSlice";

export const quotaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuotas: builder.query({
      query: () => "/quotas",
      transformResponse: (response) => response.data,
      providesTags: ["Quotas"],
    }),
  }),
});

export const { useGetQuotasQuery } = quotaApiSlice;
