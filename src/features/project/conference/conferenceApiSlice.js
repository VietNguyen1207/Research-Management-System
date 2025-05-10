import { apiSlice } from "../../api/apiSlice";

export const conferenceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConferenceFromResearch: builder.mutation({
      query: ({ projectId, conferenceData }) => ({
        url: `/Conference/create-conference-from-research/${projectId}`,
        method: "POST",
        body: conferenceData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),
    createJournalFromResearch: builder.mutation({
      query: ({ projectId, journalData }) => ({
        url: `/Journal/create-journal-from-research/${projectId}`,
        method: "POST",
        body: journalData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),
    getUserConferences: builder.query({
      query: () => ({
        url: `/Conference/my-conferences`,
        method: "GET",
      }),
      providesTags: ["UserConferences"],
      transformResponse: (response) => response,
    }),
    getConferenceDetails: builder.query({
      query: (conferenceId) => ({
        url: `/Conference/conferences/${conferenceId}/details`,
        method: "GET",
      }),
      providesTags: (result, error, conferenceId) => [
        { type: "ConferenceDetails", id: conferenceId },
      ],
      transformResponse: (response) => response,
    }),
    updateConferenceSubmissionStatus: builder.mutation({
      query: ({ conferenceId, statusData }) => ({
        url: `/Conference/conferences/${conferenceId}/submission-status`,
        method: "PUT",
        body: statusData,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
      ],
    }),
    updateApprovedConferenceDetails: builder.mutation({
      query: ({ conferenceId, detailsData }) => ({
        url: `/Conference/conferences/${conferenceId}/approved-details`,
        method: "PUT",
        body: detailsData,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
      ],
    }),
    uploadConferenceDocuments: builder.mutation({
      query: ({ conferenceId, formData }) => ({
        url: `/Conference/conferences/${conferenceId}/upload-documents`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
      ],
    }),
    requestConferenceExpense: builder.mutation({
      query: ({ conferenceId, expenseData }) => ({
        url: `/Conference/conferences/${conferenceId}/request-expense`,
        method: "POST",
        body: expenseData,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
      ],
    }),
    uploadConferenceExpenseDocuments: builder.mutation({
      query: ({ conferenceId, requestId, formData }) => ({
        url: `/Conference/conferences/${conferenceId}/expense-requests/${requestId}/upload-documents`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
        { type: "ConferenceExpenses", id: conferenceId },
      ],
    }),
    approveConferenceExpenseRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/Conference/expense-requests/${requestId}/approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["UserConferences", "ConferenceDetails"],
    }),
    rejectConferenceExpenseRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/Conference/expense-requests/${requestId}/reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["UserConferences", "ConferenceDetails"],
    }),
    getConferenceExpenses: builder.query({
      query: (conferenceId) => ({
        url: `/Conference/conferences/${conferenceId}/expenses`,
        method: "GET",
      }),
      providesTags: (result, error, conferenceId) => [
        { type: "ConferenceExpenses", id: conferenceId },
      ],
      transformResponse: (response) => response,
    }),
    requestConferenceFunding: builder.mutation({
      query: ({ conferenceId, fundingData }) => ({
        url: `/Conference/conferences/${conferenceId}/request-funding`,
        method: "POST",
        body: fundingData,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
      ],
    }),
    uploadConferenceFundingDocuments: builder.mutation({
      query: ({ conferenceId, requestId, formData }) => ({
        url: `/Conference/conferences/${conferenceId}/funding-requests/${requestId}/upload-documents`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { conferenceId }) => [
        { type: "ConferenceDetails", id: conferenceId },
        "UserConferences",
      ],
    }),
    getConferenceFunding: builder.query({
      query: (conferenceId) => ({
        url: `/Conference/conferences/${conferenceId}/funding`,
        method: "GET",
      }),
      providesTags: (result, error, conferenceId) => [
        { type: "ConferenceFunding", id: conferenceId },
      ],
      transformResponse: (response) => response,
    }),
    getUserJournals: builder.query({
      query: () => ({
        url: `/Journal/user-journals`,
        method: "GET",
      }),
      providesTags: ["UserJournals"],
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useCreateConferenceFromResearchMutation,
  useCreateJournalFromResearchMutation,
  useGetUserConferencesQuery,
  useGetConferenceDetailsQuery,
  useUpdateConferenceSubmissionStatusMutation,
  useUpdateApprovedConferenceDetailsMutation,
  useUploadConferenceDocumentsMutation,
  useRequestConferenceExpenseMutation,
  useUploadConferenceExpenseDocumentsMutation,
  useApproveConferenceExpenseRequestMutation,
  useRejectConferenceExpenseRequestMutation,
  useGetConferenceExpensesQuery,
  useRequestConferenceFundingMutation,
  useUploadConferenceFundingDocumentsMutation,
  useGetConferenceFundingQuery,
  useGetUserJournalsQuery,
} = conferenceApiSlice;
