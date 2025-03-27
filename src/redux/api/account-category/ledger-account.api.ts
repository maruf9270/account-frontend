/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

const accountCategory = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAccountCategory: build.query({
      query: (params: any) => ({
        url: "/account-category",
        method: "GET",
        params: params,
      }),
      providesTags: ["all-ledger"],
    }),

    getSingleAccountCategory: build.query({
      query: (params: string) => ({
        url: `/account-category/${params}`,
        method: "GET",
      }),
      providesTags: ["single-ledger"],
    }),

    //  crate table
    createAccountCategory: build.mutation({
      query: (data) => ({
        url: "/account-category",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["all-ledger", "single-ledger"],
    }),

    // update

    // updateLedger: build.mutation({
    //   query: (options) => ({
    //     url: `/ledger-account/${options._id}`,
    //     method: "PATCH",

    //     data: options,
    //   }),
    //   invalidatesTags: ["all-ledger", "single-ledger"],
    // }),

    // deleteLedger: build.mutation({
    //   query: (id) => ({
    //     url: `/ledger-account/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["all-ledger", "single-ledger"],
    // }),
  }),
});

export const {
  useGetAllAccountCategoryQuery,
  useGetSingleAccountCategoryQuery,
} = accountCategory;
