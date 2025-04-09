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

    getStudentGroups: builder.query({
      query: (userId) => `/users/${userId}/groups?groupType=0`,
      transformResponse: (response) => {
        if (!response.data) return [];

        // Transform the response to include student groups only
        return response.data
          .filter((group) => group.groupType === 0) // Filter for Student groups (type 0)
          .map((group) => ({
            ...group,
            groupTypeString: "Student",
            members: group.members.map((member) => ({
              ...member,
              roleString: getRoleName(member.role),
              statusString: getStatusName(member.status),
            })),
          }));
      },
      providesTags: ["StudentGroups", "UserGroups"],
    }),
  }),
});

// Helper function to convert role numbers to readable text
const getRoleName = (role) => {
  const roleMap = {
    0: "Leader",
    1: "Member",
    2: "Supervisor",
    3: "Council Chairman",
    4: "Secretary",
    5: "Council Member",
  };
  return roleMap[role] || "Unknown";
};

// Helper function to convert status numbers to readable text
const getStatusName = (status) => {
  const statusMap = {
    0: "Pending",
    1: "Accepted",
    2: "Inactive",
    3: "Rejected",
  };
  return statusMap[status] || "Unknown Status";
};

export const {
  useCreateResearchGroupMutation,
  useCreateCouncilGroupMutation,
  useGetCouncilGroupsQuery,
  useReInviteGroupMemberMutation,
  useGetStudentGroupsQuery,
} = groupApiSlice;
