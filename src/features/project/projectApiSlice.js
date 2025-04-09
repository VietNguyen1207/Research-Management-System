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
  }),
});

export const {
  useRegisterResearchProjectMutation,
  useUploadProjectDocumentMutation,
} = projectApiSlice;
