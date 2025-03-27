/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

const journalEntryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllJournalEntries: build.query({
      query: (params: any) => ({
        url: "/journal-entry",
        method: "GET",
        params: params,
      }),
      providesTags: ["all-journal-entries"],
    }),

    getSingleJournalEntry: build.query({
      query: (id: string) => ({
        url: `/journal-entry/${id}`,
        method: "GET",
      }),
      providesTags: ["single-journal-entry"],
    }),
    getSingleJournalEntryForPrint: build.query({
      query: (id: string) => ({
        url: `/journal-entry/print/${id}`,
        method: "GET",
      }),
      providesTags: ["single-journal-entry"],
    }),

    createJournalEntry: build.mutation({
      query: (data) => ({
        url: "/journal-entry",
        method: "POST",
        data,
      }),
      invalidatesTags: ["all-journal-entries"],
    }),

    updateJournalEntry: build.mutation({
      query: (options) => ({
        url: `/journal-entry/${options.entryId}`,
        method: "PATCH",
        data: options?.data,
      }),
      invalidatesTags: ["all-journal-entries", "single-journal-entry"],
    }),

    deleteJournalEntry: build.mutation({
      query: (id: string) => ({
        url: `/journal-entry/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["all-journal-entries", "single-journal-entry"],
    }),
  }),
});

export const {
  useCreateJournalEntryMutation,
  useGetAllJournalEntriesQuery,
  useGetSingleJournalEntryQuery,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useLazyGetSingleJournalEntryQuery,
  useGetSingleJournalEntryForPrintQuery,
  useLazyGetSingleJournalEntryForPrintQuery,
} = journalEntryApi;
