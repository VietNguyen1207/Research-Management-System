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
    getProjectDetails: builder.query({
      query: (projectId) => ({
        url: `/project/details/${projectId}`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
      transformResponse: (response) => response,
    }),
    getMyApprovedProjects: builder.query({
      query: () => ({
        url: "/projects/me/approved",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ projectId }) => ({
                type: "Projects",
                id: projectId,
              })),
              { type: "ApprovedProjects", id: "LIST" },
            ]
          : [{ type: "ApprovedProjects", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    getMyPendingProjects: builder.query({
      query: () => ({
        url: "/projects/me/pending",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ projectId }) => ({
                type: "Projects",
                id: projectId,
              })),
              { type: "PendingProjects", id: "LIST" },
            ]
          : [{ type: "PendingProjects", id: "LIST" }],
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
        { type: "ApprovedProjects", id: "LIST" },
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
        { type: "ApprovedProjects", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useRegisterResearchProjectMutation,
  useUploadProjectDocumentMutation,
  useGetMyProjectsQuery,
  useGetProjectDetailsQuery,
  useGetMyApprovedProjectsQuery,
  useGetMyPendingProjectsQuery,
  useGetProjectsByDepartmentQuery,
  useApproveProjectMutation,
  useRejectProjectMutation,
} = projectApiSlice;
