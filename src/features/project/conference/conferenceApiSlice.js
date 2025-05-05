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
  }),
});

export const {
  useCreateConferenceFromResearchMutation,
  useGetUserConferencesQuery,
  useGetConferenceDetailsQuery,
  useUpdateConferenceSubmissionStatusMutation,
  useUpdateApprovedConferenceDetailsMutation,
} = conferenceApiSlice;
