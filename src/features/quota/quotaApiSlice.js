import { apiSlice } from "../api/apiSlice";

export const quotaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuotas: builder.query({
      query: () => "/quotas",
      transformResponse: (response) => response.data,
      providesTags: ["Quotas"],
    }),
    getQuotaDetails: builder.query({
      query: (id) => `/quotas/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Quotas", id }],
    }),
  }),
});

export const { useGetQuotasQuery, useGetQuotaDetailsQuery } = quotaApiSlice;
