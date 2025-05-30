import { apiSlice } from "../api/apiSlice";

export const fundDisbursementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFundDisbursements: builder.query({
      query: () => "/fund-disbursement-requests",
      transformResponse: (response) => response.data,
      providesTags: (result = []) => [
        "FundDisbursements",
        ...result.map(({ requestId }) => ({
          type: "FundDisbursements",
          id: requestId,
        })),
      ],
    }),
    getPendingFundDisbursements: builder.query({
      query: () => "/pending-fund-disbursement-requests",
      transformResponse: (response) => response.data,
      providesTags: (result = []) => [
        "PendingFundDisbursements",
        ...result.map(({ requestId }) => ({
          type: "PendingFundDisbursements",
          id: requestId,
        })),
      ],
    }),
    getFundDisbursementDetails: builder.query({
      query: (disbursementId) => `/fund-disbursements/${disbursementId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [
        { type: "FundDisbursements", id: arg },
      ],
    }),
    requestFundDisbursement: builder.mutation({
      query: (requestData) => ({
        url: "/fund-disbursements",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["FundDisbursements"],
    }),
    uploadDisbursementDocument: builder.mutation({
      query: ({ disbursementId, formData }) => ({
        url: `/fund-disbursements/${disbursementId}/upload-document`,
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
      invalidatesTags: (result, error, { disbursementId }) => [
        { type: "FundDisbursements", id: disbursementId },
        "FundDisbursements", // Keep invalidating the list too
      ],
    }),
    approveFundDisbursement: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/fund-requests/${requestId}/approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "FundDisbursements", id: requestId },
        "FundDisbursements",
      ],
    }),
    rejectFundDisbursement: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/fund-requests/${requestId}/reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "FundDisbursements", id: requestId },
        "FundDisbursements",
      ],
    }),
    officeApproveFundDisbursement: builder.mutation({
      query: ({ disbursementId, formData }) => ({
        url: `/fund-disbursements/${disbursementId}/office-approve`,
        method: "POST",
        body: formData,
        formData: true, // Ensure Content-Type is set to multipart/form-data
      }),
      invalidatesTags: (result, error, { disbursementId }) => [
        { type: "FundDisbursements", id: disbursementId },
        "PendingFundDisbursements", // To refresh the pending list
        "FundDisbursements", // To refresh any general list of disbursements
      ],
    }),
  }),
});

export const {
  useGetFundDisbursementsQuery,
  useGetPendingFundDisbursementsQuery,
  useGetFundDisbursementDetailsQuery,
  useRequestFundDisbursementMutation,
  useUploadDisbursementDocumentMutation,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
  useOfficeApproveFundDisbursementMutation,
} = fundDisbursementApiSlice;
