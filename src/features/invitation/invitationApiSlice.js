import { apiSlice } from "../api/apiSlice";

export const invitationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    acceptInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/invitations/${invitationId}/accept`,
        method: "POST",
      }),
      // Invalidate relevant cache tags to trigger re-fetching of data
      invalidatesTags: [
        "Notifications",
        "Groups",
        "UserGroups",
        { type: "Invitations", id: "LIST" },
      ],
    }),

    rejectInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/invitations/${invitationId}/reject`,
        method: "POST",
      }),
      // Invalidate relevant cache tags to trigger re-fetching of data
      invalidatesTags: [
        "Notifications",
        "Groups",
        { type: "Invitations", id: "LIST" },
      ],
    }),

    getInvitations: builder.query({
      query: (userId) => `/invitations?userId=${userId}`,
      transformResponse: (response) => {
        if (!response.data) return [];
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ invitationId }) => ({
                type: "Invitations",
                id: invitationId,
              })),
              { type: "Invitations", id: "LIST" },
            ]
          : [{ type: "Invitations", id: "LIST" }],
    }),
  }),
});

export const {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useGetInvitationsQuery,
} = invitationApiSlice;
