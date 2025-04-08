import { apiSlice } from "../api/apiSlice";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createResearchGroup: builder.mutation({
      query: (groupData) => ({
        url: "/research-groups",
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Groups", "UserGroups"],
    }),

    createCouncilGroup: builder.mutation({
      query: (councilData) => ({
        url: "/council-groups",
        method: "POST",
        body: councilData,
      }),
      invalidatesTags: ["Groups", "UserGroups", "CouncilGroups"],
    }),

    getCouncilGroups: builder.query({
      query: () => "/council-groups",
      transformResponse: (response) => {
        // Transform the response to include readable role and status names
        if (response.data) {
          return {
            ...response,
            data: response.data.map((council) => ({
              ...council,
              members: council.members.map((member) => ({
                ...member,
                roleText: getRoleName(member.role),
                statusText: getStatusName(member.status),
              })),
            })),
          };
        }
        return response;
      },
      providesTags: ["CouncilGroups"],
    }),

    reInviteGroupMember: builder.mutation({
      query: (inviteData) => ({
        url: "/groups/re-invite",
        method: "POST",
        body: inviteData,
      }),
      invalidatesTags: ["Groups", "UserGroups", "CouncilGroups"],
    }),
  }),
});

// Helper function to convert role numbers to readable text
const getRoleName = (role) => {
  switch (role) {
    case 0:
      return "Leader";
    case 1:
      return "Member";
    case 2:
      return "Supervisor";
    case 3:
      return "Chairman";
    case 4:
      return "Secretary";
    case 5:
      return "Council Member";
    default:
      return "Unknown Role";
  }
};

// Helper function to convert status numbers to readable text
const getStatusName = (status) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Accepted";
    case 2:
      return "Inactive";
    case 3:
      return "Rejected";
    default:
      return "Unknown Status";
  }
};

export const {
  useCreateResearchGroupMutation,
  useCreateCouncilGroupMutation,
  useGetCouncilGroupsQuery,
  useReInviteGroupMemberMutation,
} = groupApiSlice;
