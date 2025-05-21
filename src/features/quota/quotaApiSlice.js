import { apiSlice } from "../api/apiSlice";

export const quotaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuotas: builder.query({
      query: () => "/quotas",
      transformResponse: (response) => response.data,
      providesTags: ["Quotas"],
    }),
    getDepartmentQuotas: builder.query({
      query: () => "/department-quotas",
      transformResponse: (response) => response.data,
      providesTags: ["DepartmentQuotas"],
    }),
    getQuotaDetails: builder.query({
      query: (id) => `/quotas/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Quotas", id }],
    }),
    getDepartmentQuotaDetails: builder.query({
      query: (departmentId) => `/department-quotas/${departmentId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "DepartmentQuotas", id }],
    }),
    createQuota: builder.mutation({
      query: (quotaData) => ({
        url: "/allocate-department-quotas",
        method: "POST",
        body: quotaData,
      }),
      invalidatesTags: ["Quotas", "DepartmentQuotas"],
    }),
    // updateQuota: builder.mutation({
    //   query: ({ id, ...data }) => ({
    //     url: `/quotas/${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: (result, error, { id }) => [
    //     { type: "Quotas", id },
    //     "DepartmentQuotas",
    //   ],
    // }),
  }),
});

export const {
  useGetQuotasQuery,
  useGetDepartmentQuotasQuery,
  useGetQuotaDetailsQuery,
  useGetDepartmentQuotaDetailsQuery,
  useCreateQuotaMutation,
  useUpdateQuotaMutation,
} = quotaApiSlice;
