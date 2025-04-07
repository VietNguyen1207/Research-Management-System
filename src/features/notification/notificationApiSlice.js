import { apiSlice } from "../api/apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: (userId) => `/notifications?userId=${userId}`,
      transformResponse: (response) => {
        if (!response.data) return [];

        // Transform the API response data into a format better suited for the frontend
        return response.data.map((notification) => ({
          id: notification.notificationId,
          timestamp: notification.createdAt || new Date().toISOString(), // Use current date as fallback
          title: notification.title,
          message: notification.message,
          read: notification.isRead,
          invitationId: notification.invitationId,
          // Map status to notification type
          type: mapNotificationType(notification),
          status: notification.status,
          // Additional properties needed by the UI
          groupName: extractGroupName(notification.message),
          sender: "Member", // Default value, ideally this would come from the API
          responded: notification.status !== 0, // If status is not pending
          accepted: notification.status === 1, // If status is accepted
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notifications", id })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    // Placeholder for future implementations
    acceptInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/invitations/${invitationId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "Groups", "UserGroups"],
    }),

    rejectInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/invitations/${invitationId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "Groups"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: "Notifications", id: notificationId },
        { type: "Notifications", id: "LIST" },
      ],
    }),

    markAllNotificationsAsRead: builder.mutation({
      query: (userId) => ({
        url: `/notifications/read-all?userId=${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

// Helper function to determine notification type based on the notification data
function mapNotificationType(notification) {
  if (notification.invitationId) {
    return "invitation";
  } else if (notification.status === 0) {
    // Pending
    return "update";
  } else {
    return "response";
  }
}

// Helper function to extract group name from message
function extractGroupName(message) {
  if (!message) return "";

  // Try to extract group name from "You have been invited to join the group 'Group Name'"
  const match = message.match(/join the group '([^']+)'/);
  return match ? match[1] : "";
}

export const {
  useGetUserNotificationsQuery,
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApiSlice;
