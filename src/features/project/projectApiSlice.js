import { apiSlice } from "../api/apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerResearchProject: builder.mutation({
      query: (projectData) => ({
        url: "/project/register-research-project",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Projects"],
    }),
    uploadProjectDocument: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/project/${projectId}/upload-document`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),
    getMyProjects: builder.query({
      query: () => ({
        url: "/project/get-my-projects",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ projectId }) => ({
                type: "Projects",
                id: projectId,
              })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    getProjectsByDepartment: builder.query({
      query: (departmentId) => ({
        url: `/project/get-project-by-departmentId/${departmentId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ projectId }) => ({
                type: "DepartmentProjects",
                id: projectId,
              })),
              { type: "DepartmentProjects", id: "LIST" },
            ]
          : [{ type: "DepartmentProjects", id: "LIST" }],
    }),
    approveProject: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/project/${projectId}/council-approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "DepartmentProjects", id: projectId },
      ],
    }),
    rejectProject: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/project/${projectId}/council-reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "DepartmentProjects", id: projectId },
      ],
    }),
  }),
});

export const {
  useRegisterResearchProjectMutation,
  useUploadProjectDocumentMutation,
  useGetMyProjectsQuery,
  useGetProjectsByDepartmentQuery,
  useApproveProjectMutation,
  useRejectProjectMutation,
} = projectApiSlice;
