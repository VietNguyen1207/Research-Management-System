import { apiSlice } from "../api/apiSlice";

export const fundDisbursementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestFundDisbursement: builder.mutation({
      query: (requestData) => ({
        url: "/fund-disbursements",
        method: "POST",
        body: requestData,
      }),
    }),
    uploadDisbursementDocument: builder.mutation({
      query: ({ disbursementId, formData }) => ({
        url: `/fund-disbursements/${disbursementId}/upload-document`,
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
  }),
});

export const {
  useRequestFundDisbursementMutation,
  useUploadDisbursementDocumentMutation,
} = fundDisbursementApiSlice;
