import { apiSlice } from "../api/apiSlice";

export const fundDisbursementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFundDisbursements: builder.query({
      query: () => "/fund-disbursements",
      transformResponse: (response) => response.data,
      providesTags: (result = []) => [
        "FundDisbursements",
        ...result.map(({ fundDisbursementId }) => ({
          type: "FundDisbursements",
          id: fundDisbursementId,
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
      query: ({ disbursementId, formData }) => ({
        url: `/fund-disbursements/${disbursementId}/office-approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { disbursementId }) => [
        { type: "FundDisbursements", id: disbursementId },
        "FundDisbursements",
      ],
    }),
    rejectFundDisbursement: builder.mutation({
      query: ({ disbursementId, formData }) => ({
        url: `/fund-disbursements/${disbursementId}/office-reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { disbursementId }) => [
        { type: "FundDisbursements", id: disbursementId },
        "FundDisbursements",
      ],
    }),
  }),
});

export const {
  useGetFundDisbursementsQuery,
  useGetFundDisbursementDetailsQuery,
  useRequestFundDisbursementMutation,
  useUploadDisbursementDocumentMutation,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
} = fundDisbursementApiSlice;
