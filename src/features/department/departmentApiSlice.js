import { apiSlice } from "../api/apiSlice";

export const departmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => "/departments",
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Departments"],
    }),
  }),
});

export const { useGetDepartmentsQuery } = departmentApiSlice;
