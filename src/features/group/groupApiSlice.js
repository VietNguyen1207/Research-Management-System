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
  }),
});

export const { useCreateResearchGroupMutation } = groupApiSlice;
