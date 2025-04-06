import { apiSlice } from "../api/apiSlice";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroupsByUser: builder.query({
      query: (userId) => `/groups-by-user/${userId}`,
      providesTags: ["Groups"],
      transformResponse: (response) => {
        // Transform the enum values to readable strings
        return response.map((group) => ({
          ...group,
          groupTypeString: getGroupTypeString(group.groupType),
          members: group.members.map((member) => ({
            ...member,
            roleString: getMemberRoleString(member.role),
            statusString: getMemberStatusString(member.status),
          })),
        }));
      },
    }),

    // New endpoint for creating a research group
    createResearchGroup: builder.mutation({
      query: (groupData) => ({
        url: "/research-groups",
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Groups"],
    }),
  }),
});

// Helper functions to map enum values to strings
const getGroupTypeString = (groupType) => {
  const groupTypeMap = {
    0: "Student",
    1: "Council",
  };
  return groupTypeMap[groupType] || "Unknown";
};

const getMemberRoleString = (role) => {
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

const getMemberStatusString = (status) => {
  const statusMap = {
    0: "Pending",
    1: "Active",
    2: "Inactive",
    3: "Rejected",
  };
  return statusMap[status] || "Unknown";
};

export const { useGetGroupsByUserQuery, useCreateResearchGroupMutation } =
  groupApiSlice;
