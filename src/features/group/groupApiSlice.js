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
      invalidatesTags: ["Groups", "UserGroups"],
    }),
  }),
});

export const { useCreateResearchGroupMutation, useCreateCouncilGroupMutation } =
  groupApiSlice;
