import { apiSlice } from "../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLecturers: builder.query({
      query: () => "/users/lecturers",
      transformResponse: (response) => {
        // Map lecturer level to readable format
        const levelMap = {
          0: "Professor",
          1: "Associate Professor",
          2: "PhD",
          3: "Master",
          4: "Bachelor",
        };

        // Group lecturers by department for better UI organization
        const lecturersByDepartment = {};

        if (response.data && Array.isArray(response.data)) {
          response.data.forEach((lecturer) => {
            // Add human-readable level
            lecturer.levelText = levelMap[lecturer.level] || "Unknown";

            // Group by department
            if (!lecturersByDepartment[lecturer.departmentId]) {
              lecturersByDepartment[lecturer.departmentId] = {
                departmentId: lecturer.departmentId,
                departmentName: lecturer.departmentName || "Unknown Department",
                lecturers: [],
              };
            }

            lecturersByDepartment[lecturer.departmentId].lecturers.push(
              lecturer
            );
          });
        }

        return {
          lecturers: response.data || [],
          lecturersByDepartment: Object.values(lecturersByDepartment),
        };
      },
      providesTags: ["Lecturers"],
    }),

    getStudents: builder.query({
      query: () => "/users/students",
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: ["Students"],
    }),

    // New endpoint for getting both students and lecturers
    getAcademicUsers: builder.query({
      query: () => "/users/academic",
      transformResponse: (response) => {
        // Map lecturer level to readable format
        const levelMap = {
          0: "Professor",
          1: "Associate Professor",
          2: "PhD",
          3: "Master",
          4: "Bachelor",
        };

        // Add readable level to lecturers
        const lecturers = response.data?.lecturers || [];
        lecturers.forEach((lecturer) => {
          lecturer.levelText = levelMap[lecturer.level] || "Unknown";
          lecturer.userType = "Lecturer"; // Add a type identifier
        });

        // Add a type identifier to students
        const students = response.data?.students || [];
        students.forEach((student) => {
          student.userType = "Student";
        });

        // Combine all users for autocomplete
        const allUsers = [...lecturers, ...students];

        return {
          students,
          lecturers,
          allUsers,
        };
      },
      providesTags: ["AcademicUsers"],
    }),

    // New endpoint to get user groups
    getUserGroups: builder.query({
      query: (userId) => `/users/${userId}/groups`,
      transformResponse: (response) => {
        if (!response.data) return [];

        // Transform the enum values to readable strings
        return response.data.map((group) => ({
          ...group,
          groupTypeString: getGroupTypeString(group.groupType),
          members: group.members.map((member) => ({
            ...member,
            roleString: getMemberRoleString(member.role),
            statusString: getMemberStatusString(member.status),
          })),
        }));
      },
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ groupId }) => ({ type: "Groups", id: groupId })),
              { type: "Groups", id: "LIST" },
              { type: "UserGroups", id: userId },
            ]
          : [
              { type: "Groups", id: "LIST" },
              { type: "UserGroups", id: userId },
            ],
    }),

    getAllUsers: builder.query({
      query: () => "/users",
      transformResponse: (response) => {
        if (!response.data) return [];

        // Transform the level to readable format
        const levelMap = {
          0: "Professor",
          1: "Associate Professor",
          2: "PhD",
          3: "Master",
          4: "Bachelor",
        };

        // Map status to readable format
        const statusMap = {
          0: "Inactive",
          1: "Active",
          2: "Suspended",
        };

        return response.data.map((user) => ({
          ...user,
          levelText: user.level ? levelMap[user.level] : null,
          statusText: statusMap[user.status] || "Unknown",
          // Exclude the password
          password: undefined,
        }));
      },
      providesTags: ["Users"],
    }),

    // Add this new endpoint to your userApiSlice.js file
    getUserBasicGroups: builder.query({
      query: () => "/users/me/groups/basic",
      transformResponse: (response) => {
        if (!response.data) return [];

        // Transform the enum values to readable strings and add default dates if missing
        return response.data.map((group) => ({
          ...group,
          groupTypeString: getGroupTypeString(group.groupType),
          statusString: getMemberStatusString(group.status),
          // Add a default date if missing
          createdAt: group.createdAt || null,
        }));
      },
      providesTags: ["UserGroups", "Groups"],
    }),
  }),
});

// Helper functions to map enum values to strings (moved from groupApiSlice)
const getGroupTypeString = (groupType) => {
  const groupTypeMap = {
    0: "Student",
    1: "Council",
    2: "Research",
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
    6: "Stakeholder",
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

export const {
  useGetLecturersQuery,
  useGetStudentsQuery,
  useGetAcademicUsersQuery,
  useGetUserGroupsQuery,
  useGetUserBasicGroupsQuery,
  useGetAllUsersQuery,
} = userApiSlice;
