/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

const ledgerAccount = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLedger: build.query({
      query: (params: any) => ({
        url: "/ledger-account",
        method: "GET",
        params: params,
      }),
      providesTags: ["all-ledger"],
    }),
    getTrialBalanceData: build.query({
      query: (params: any) => ({
        url: "/ledger-account/statements/trial-balance",
        method: "GET",
        params: params,
      }),
      providesTags: ["all-ledger"],
    }),
    getIncomeStatementData: build.query({
      query: (params: any) => ({
        url: "/ledger-account/statements/income-statement",
        method: "GET",
        params: params,
      }),
      providesTags: ["all-ledger"],
    }),
    getLedgerBalance: build.query({
      query: ({ id, params }) => ({
        url: `/ledger-account/statements/ledger-balance/${id}`,
        method: "GET",
        params: params,
      }),
      providesTags: ["all-ledger"],
    }),
    getSingleLedger: build.query({
      query: (params: string) => ({
        url: `/ledger-account/${params}`,
        method: "GET",
      }),
      providesTags: ["single-ledger"],
    }),

    //  crate table
    createLedger: build.mutation({
      query: (data) => ({
        url: "/ledger-account",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["all-ledger", "single-ledger"],
    }),

    // update

    updateLedger: build.mutation({
      query: (options) => ({
        url: `/ledger-account/${options._id}`,
        method: "PATCH",

        data: options,
      }),
      invalidatesTags: ["all-ledger", "single-ledger"],
    }),

    deleteLedger: build.mutation({
      query: (id) => ({
        url: `/ledger-account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["all-ledger", "single-ledger"],
    }),
  }),
});

export const {
  useCreateLedgerMutation,
  useGetAllLedgerQuery,
  useGetSingleLedgerQuery,
  useUpdateLedgerMutation,
  useDeleteLedgerMutation,
  useLazyGetSingleLedgerQuery,
  useGetTrialBalanceDataQuery,
  useGetIncomeStatementDataQuery,
  useGetLedgerBalanceQuery,
} = ledgerAccount;
