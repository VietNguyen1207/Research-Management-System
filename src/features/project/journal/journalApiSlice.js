import { apiSlice } from "../../api/apiSlice";

export const journalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJournalDetails: builder.query({
      query: (journalId) => ({
        url: `/Journal/journal-details/${journalId}`,
        method: "GET",
      }),
      providesTags: (result, error, journalId) => [
        { type: "JournalDetails", id: journalId },
      ],
      transformResponse: (response) => response,
    }),

    uploadJournalDocuments: builder.mutation({
      query: ({ journalId, formData }) => ({
        url: `/Journal/upload-documents/${journalId}`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { journalId }) => [
        { type: "JournalDetails", id: journalId },
      ],
    }),

    updateJournalDetails: builder.mutation({
      query: ({ journalId, detailsData }) => ({
        url: `/Journal/update-details/${journalId}`,
        method: "PUT",
        body: detailsData,
      }),
      invalidatesTags: (result, error, { journalId }) => [
        { type: "JournalDetails", id: journalId },
      ],
    }),

    getJournalFunding: builder.query({
      query: (journalId) => ({
        url: `/Journal/journals/${journalId}/fund-disbursements`,
        method: "GET",
      }),
      providesTags: (result, error, journalId) => [
        { type: "JournalFunding", id: journalId },
      ],
      transformResponse: (response) => response,
    }),

    requestJournalFunding: builder.mutation({
      query: ({ journalId, fundingData }) => ({
        url: `/Journal/journals/${journalId}/request-funding`,
        method: "POST",
        body: fundingData,
      }),
      invalidatesTags: (result, error, { journalId }) => [
        { type: "JournalDetails", id: journalId },
        { type: "JournalFunding", id: journalId },
        "UserJournals",
      ],
    }),

    uploadJournalFundingDocuments: builder.mutation({
      query: ({ journalId, requestId, formData }) => ({
        url: `/Journal/journals/${journalId}/funding-requests/${requestId}/upload-documents`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { journalId }) => [
        { type: "JournalDetails", id: journalId },
        { type: "JournalFunding", id: journalId },
        "UserJournals",
      ],
    }),

    approveJournalFundingRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/Journal/funding-requests/${requestId}/approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["UserJournals", "JournalDetails", "JournalFunding"],
    }),

    rejectJournalFundingRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/Journal/funding-requests/${requestId}/reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["UserJournals", "JournalDetails", "JournalFunding"],
    }),
  }),
});

export const {
  useGetJournalDetailsQuery,
  useUploadJournalDocumentsMutation,
  useUpdateJournalDetailsMutation,
  useGetJournalFundingQuery,
  useRequestJournalFundingMutation,
  useUploadJournalFundingDocumentsMutation,
  useApproveJournalFundingRequestMutation,
  useRejectJournalFundingRequestMutation,
} = journalApiSlice;
