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

    createAssessmentCouncil: builder.mutation({
      query: (councilData) => ({
        url: "/assessment-council",
        method: "POST",
        body: councilData,
      }),
      invalidatesTags: ["Groups", "UserGroups", "CouncilGroups"],
    }),

    createInspectionCouncil: builder.mutation({
      query: (councilData) => ({
        url: "/inspection-council",
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
              // Ensure expertises is always an array even if not provided
              expertises: council.expertises || [],
              // Ensure groupTypeName has a default fallback
              groupTypeName:
                council.groupTypeName || getGroupTypeName(council.groupType),
              // Add readable group status
              groupStatusName: getGroupStatusName(council.status),
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

    getUserResearchGroups: builder.query({
      query: (userId) => `/users/${userId}/groups`,
      transformResponse: (response) => {
        if (!response.data) return [];

        // Transform the response to include both Student and Research groups
        return response.data
          .filter((group) => group.groupType === 0 || group.groupType === 2)
          .map((group) => ({
            ...group,
            groupTypeString: getGroupTypeName(group.groupType),
            members: group.members.map((member) => ({
              ...member,
              roleString: getRoleName(member.role),
              statusString: getStatusName(member.status),
            })),
          }));
      },
      providesTags: ["StudentGroups", "ResearchGroups", "UserGroups"],
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
    6: "Stakeholder",
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

// Group status constants
export const GROUP_STATUS = {
  PENDING: 0,
  ACTIVE: 1,
  INACTIVE: 2,
  ASSIGNED: 3,
};

// Helper function to convert group status numbers to readable text
export const getGroupStatusName = (status) => {
  const groupStatusMap = {
    [GROUP_STATUS.PENDING]: "Pending",
    [GROUP_STATUS.ACTIVE]: "Active",
    [GROUP_STATUS.INACTIVE]: "Inactive",
    [GROUP_STATUS.ASSIGNED]: "Assigned",
  };
  return groupStatusMap[status] || "Unknown Status";
};

export const GROUP_TYPE = {
  STUDENT: 0,
  RESEARCH_COUNCIL: 1,
  RESEARCH: 2,
  INSPECTION_COUNCIL: 3,
  ASSESSMENT_COUNCIL: 4,
};

export const getGroupTypeName = (type) => {
  const groupTypeMap = {
    [GROUP_TYPE.STUDENT]: "Student",
    [GROUP_TYPE.RESEARCH_COUNCIL]: "Review Council",
    [GROUP_TYPE.RESEARCH]: "Research",
    [GROUP_TYPE.INSPECTION_COUNCIL]: "Inspection Council",
    [GROUP_TYPE.ASSESSMENT_COUNCIL]: "Assessment Council",
  };
  return groupTypeMap[type] || "Unknown Group Type";
};
// -- END NEW --

export const {
  useCreateResearchGroupMutation,
  useCreateCouncilGroupMutation,
  useCreateAssessmentCouncilMutation,
  useCreateInspectionCouncilMutation,
  useGetCouncilGroupsQuery,
  useReInviteGroupMemberMutation,
  useGetUserResearchGroupsQuery,
} = groupApiSlice;
