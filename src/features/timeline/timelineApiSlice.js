import { apiSlice } from "../api/apiSlice";

export const timelineApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimelineSequences: builder.query({
      query: () => "/timeline-sequences",
      transformResponse: (response) => response.data,
      providesTags: ["TimelineSequences"],
    }),

    getTimelinesBySequence: builder.query({
      query: (sequenceId) => `/timelines/by-sequence/${sequenceId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, sequenceId) => [
        { type: "Timelines", id: sequenceId },
      ],
    }),

    createTimelineSequence: builder.mutation({
      query: (sequenceData) => ({
        url: "/timeline-sequences",
        method: "POST",
        body: sequenceData,
      }),
      invalidatesTags: ["TimelineSequences"],
    }),
    createTimeline: builder.mutation({
      query: (timelineData) => ({
        url: "/timelines",
        method: "POST",
        body: timelineData,
      }),
      invalidatesTags: ["Timelines"],
    }),

    updateTimeline: builder.mutation({
      query: ({ id, ...timelineData }) => ({
        url: `/timelines/${id}`,
        method: "PUT",
        body: timelineData,
      }),
      invalidatesTags: ["Timelines"],
    }),

    deleteTimeline: builder.mutation({
      query: (id) => ({
        url: `/timelines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timelines"],
    }),

    getAllTimelines: builder.query({
      query: () => "/timelines",
      transformResponse: (response) => response.data,
      providesTags: ["Timelines"],
    }),
  }),
});

export const {
  useGetTimelineSequencesQuery,
  useGetTimelinesBySequenceQuery,
  useCreateTimelineSequenceMutation,
  useGetTimelinesQuery,
  useCreateTimelineMutation,
  useUpdateTimelineMutation,
  useDeleteTimelineMutation,
  useGetAllTimelinesQuery,
} = timelineApiSlice;
