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
    updateProjectPhase: builder.mutation({
      query: ({ projectPhaseId, data }) => ({
        url: `/project-phases/${projectPhaseId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { projectPhaseId }) => [
        { type: "Projects", id: "LIST" },
      ],
    }),
    getDepartmentProjectRequests: builder.query({
      query: (departmentId) => ({
        url: `/departments/${departmentId}/project-requests`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ requestId }) => ({
                type: "DepartmentProjectRequests",
                id: requestId,
              })),
              { type: "DepartmentProjectRequests", id: "LIST" },
            ]
          : [{ type: "DepartmentProjectRequests", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    approveProjectRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/project-requests/${requestId}/approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "DepartmentProjectRequests", id: "LIST" },
      ],
    }),
    rejectProjectRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/project-requests/${requestId}/reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "DepartmentProjectRequests", id: "LIST" },
      ],
    }),
    getProjectRequestDetails: builder.query({
      query: (requestId) => ({
        url: `/project-requests/${requestId}/details`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "ProjectRequestDetails", id: requestId },
      ],
      transformResponse: (response) => response,
    }),
    getPendingDepartmentProjectRequests: builder.query({
      query: (departmentId) => ({
        url: `/departments/${departmentId}/project-requests/pending`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ requestId }) => ({
                type: "DepartmentPendingProjectRequests",
                id: requestId,
              })),
              { type: "DepartmentPendingProjectRequests", id: "LIST" },
            ]
          : [{ type: "DepartmentPendingProjectRequests", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    getUserPendingProjectRequests: builder.query({
      query: () => ({
        url: `/users/me/project-requests/pending`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ requestId }) => ({
                type: "UserPendingProjectRequests",
                id: requestId,
              })),
              { type: "UserPendingProjectRequests", id: "LIST" },
            ]
          : [{ type: "UserPendingProjectRequests", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    getUserProjectRequests: builder.query({
      query: () => ({
        url: `/users/me/project-requests`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ requestId }) => ({
                type: "UserProjectRequests",
                id: requestId,
              })),
              { type: "UserProjectRequests", id: "LIST" },
            ]
          : [{ type: "UserProjectRequests", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    getProjectCompletionSummary: builder.query({
      query: (projectId) => ({
        url: `/projects/${projectId}/completion-summary`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "ProjectCompletionSummary", id: projectId },
      ],
    }),
    requestProjectCompletion: builder.mutation({
      query: ({ projectId, completionData }) => ({
        url: `/project/${projectId}/request-completion`,
        method: "POST",
        body: completionData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "ProjectCompletionSummary", id: projectId },
      ],
    }),
    uploadCompletionDocuments: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/project/${projectId}/upload-completion-documents`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "ProjectCompletionSummary", id: projectId },
      ],
    }),
    approveCompletionRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/completion-requests/${requestId}/approve`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "DepartmentPendingProjectRequests", id: "LIST" },
        { type: "ProjectRequestDetails", id: requestId },
      ],
    }),
    rejectCompletionRequest: builder.mutation({
      query: ({ requestId, formData }) => ({
        url: `/completion-requests/${requestId}/reject`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "DepartmentPendingProjectRequests", id: "LIST" },
        { type: "ProjectRequestDetails", id: requestId },
      ],
    }),
    assignProjectsToCouncil: builder.mutation({
      query: (assignmentData) => ({
        url: "/projects/assign-to-council",
        method: "POST",
        body: assignmentData,
      }),
      invalidatesTags: (result, error, { councilGroupId, assignments }) => [
        { type: "DepartmentProjectRequests", id: "LIST" },
        ...(assignments
          ? assignments.map(({ projectRequestId }) => ({
              type: "ProjectRequestDetails",
              id: projectRequestId,
            }))
          : []),
      ],
    }),
    getAllProjectRequests: builder.query({
      query: () => "/project-requests",
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ requestId }) => ({
                type: "ProjectRequests",
                id: requestId,
              })),
              { type: "ProjectRequests", id: "LIST" },
            ]
          : [{ type: "ProjectRequests", id: "LIST" }],
      transformResponse: (response) => response,
    }),
    getAssignedProjectsForCouncil: builder.query({
      query: (councilGroupId) => ({
        url: `/council/${councilGroupId}/assigned-projects`,
        method: "GET",
      }),
      providesTags: (result, error, councilGroupId) => [
        { type: "AssignedProjects", id: councilGroupId },
      ],
      transformResponse: (response) => response.data,
    }),
    getProjectRequestVotes: builder.query({
      query: (projectRequestId) => ({
        url: `/vote/project-request/${projectRequestId}`,
        method: "GET",
      }),
      providesTags: (result, error, projectRequestId) => [
        { type: "ProjectRequestVotes", id: projectRequestId },
      ],
      transformResponse: (response) => response.data,
    }),
    submitProjectVote: builder.mutation({
      query: (voteData) => ({
        url: "/vote/project-request",
        method: "POST",
        body: voteData,
      }),
      invalidatesTags: (result, error, { projectRequestId }) => [
        { type: "ProjectRequestVotes", id: projectRequestId },
        { type: "ProjectRequestDetails", id: projectRequestId },
      ],
    }),
    finalizeProjectVoting: builder.mutation({
      query: ({ projectRequestId, councilId }) => ({
        url: `/projects/finalize-voting/${projectRequestId}/${councilId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { projectRequestId, councilId }) => [
        { type: "ProjectRequestDetails", id: projectRequestId },
        { type: "ProjectRequestVotes", id: projectRequestId },
        { type: "ProjectRequests", id: "LIST" },
        { type: "DepartmentProjectRequests", id: "LIST" },
        { type: "UserProjectRequests", id: "LIST" },
        { type: "AssignedProjects", id: councilId },
      ],
    }),
    getReviewedProjectRequestsByCouncil: builder.query({
      query: (councilGroupId) => ({
        url: `/councils/${councilGroupId}/project-requests/reviewed`,
        method: "GET",
      }),
      providesTags: (result, error, councilGroupId) => [
        { type: "ReviewedCouncilRequests", id: councilGroupId },
      ],
      transformResponse: (response) => response.data,
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
  useUpdateProjectPhaseMutation,
  useGetDepartmentProjectRequestsQuery,
  useApproveProjectRequestMutation,
  useRejectProjectRequestMutation,
  useGetProjectRequestDetailsQuery,
  useGetPendingDepartmentProjectRequestsQuery,
  useGetUserPendingProjectRequestsQuery,
  useGetUserProjectRequestsQuery,
  useGetProjectCompletionSummaryQuery,
  useRequestProjectCompletionMutation,
  useUploadCompletionDocumentsMutation,
  useApproveCompletionRequestMutation,
  useRejectCompletionRequestMutation,
  useAssignProjectsToCouncilMutation,
  useGetAllProjectRequestsQuery,
  useGetAssignedProjectsForCouncilQuery,
  useGetProjectRequestVotesQuery,
  useSubmitProjectVoteMutation,
  useFinalizeProjectVotingMutation,
  useGetReviewedProjectRequestsByCouncilQuery,
} = projectApiSlice;
