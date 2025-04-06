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
  }),
});

export const {
  useGetLecturersQuery,
  useGetStudentsQuery,
  useGetAcademicUsersQuery,
} = userApiSlice;
