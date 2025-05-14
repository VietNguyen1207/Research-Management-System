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
    createQuota: builder.mutation({
      query: (quotaData) => ({
        url: "/allocate-department-quotas",
        method: "POST",
        body: quotaData,
      }),
      invalidatesTags: ["Quotas"],
    }),
    updateQuota: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quotas/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Quotas", id }],
    }),
  }),
});

export const {
  useGetQuotasQuery,
  useGetQuotaDetailsQuery,
  useCreateQuotaMutation,
  useUpdateQuotaMutation,
} = quotaApiSlice;
