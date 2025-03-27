/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Plus,
  Loader2,
} from "lucide-react";
import {
  useDeleteJournalEntryMutation,
  useGetAllJournalEntriesQuery,
} from "@/redux/api/journal-entry/journalEntry.api";
import RPagination from "../RPagination";
import { SelectPicker } from "rsuite";
import OptionSelector from "../OptionSelector";
import useQueryBuilder, { QueryBuilder } from "@/helpers/QueryBUilder";
import AccountOptionSelector from "./AccountOptionSelector";
import Link from "next/link";
import { ENUM_MODE } from "@/enums/EnumMode";
import DeleteButton from "../DeleteWIthDialog";

function App() {
  const { addField, deleteField, query } = useQueryBuilder();

  //   data source
  const {
    data: journalEntries,
    isLoading: journalEntryLoading,
    isFetching: journalEntryFetching,
  } = useGetAllJournalEntriesQuery({ date: -1, ...query });

  const handleOptionChange = (v: string) => {
    addField("account", v);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Journal Entries
        </h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <div className="relative">
                <AccountOptionSelector handleChange={handleOptionChange} />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={query?.from}
                  onChange={(e) => addField("from", e.target.value)}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={query?.to}
                  onChange={(e) => addField("to", e.target.value)}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end flex-col">
              <br />
              <Link href={"/journal/new?mode=new"}>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  <Plus className="h-5 w-5" />
                  Add New
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Journal Entries Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {journalEntryLoading || journalEntryFetching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">
                  Loading journal entries...
                </p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Account
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Debit (TK)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Credit (TK)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {journalEntries?.data?.data?.map(
                      (journalGroup: any, groupIndex: any) => {
                        const entries = journalGroup.entries || [];
                        return (
                          <React.Fragment key={journalGroup.entryId}>
                            {entries.map((entry: any, entryIndex: any) => (
                              <tr
                                key={entry._id}
                                className={
                                  entryIndex === 0
                                    ? "border-t-4 border-gray-200"
                                    : ""
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
                                      {entry.account.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {entry.account.accountType}
                                    </span>
                                    {entry.comment && (
                                      <span className="text-xs italic text-gray-500">
                                        {entry.comment}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {entry.debit > 0 ? (
                                    <span className="text-sm text-gray-900">
                                      {entry.debit.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-400">
                                      -
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {entry.credit > 0 ? (
                                    <span className="text-sm text-gray-900">
                                      {entry.credit.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-400">
                                      -
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">
                                    {new Date(
                                      entry.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      entry.journalType === "general"
                                        ? "bg-green-100 text-green-800"
                                        : entry.journalType === "rectifying"
                                        ? "bg-blue-100 text-blue-800"
                                        : entry.journalType === "adjusting"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {entry.journalType === "general"
                                      ? "General"
                                      : entry.journalType === "rectifying"
                                      ? "Rectifying"
                                      : entry.journalType === "adjusting"
                                      ? "Adjusting"
                                      : "Closing"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {entryIndex === 0 && (
                                    <div className="flex space-x-2">
                                      <Link
                                        href={`/journal/new?mode=${ENUM_MODE.VIEW}&entryId=${entry?.entryId}`}
                                      >
                                        <button className="text-blue-600 hover:text-blue-900">
                                          <Eye className="h-5 w-5" />
                                        </button>
                                      </Link>
                                      <Link
                                        href={`/journal/new?mode=${ENUM_MODE.UPDATE}&entryId=${entry?.entryId}`}
                                      >
                                        <button className="text-yellow-600 hover:text-yellow-900">
                                          <Edit className="h-5 w-5" />
                                        </button>
                                      </Link>
                                      <DeleteButton
                                        id={entry?.entryId}
                                        deleteApi={
                                          useDeleteJournalEntryMutation
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {/* Summary row for the group */}
                            <tr className="bg-gray-50">
                              <td
                                colSpan={6}
                                className="px-6 py-2 text-xs text-gray-500"
                              >
                                Entries: {entries.length}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      }
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4  border-t border-gray-200 w-full">
                  <RPagination
                    addField={addField}
                    deleteField={deleteField}
                    query={query}
                    total={journalEntries?.data?.meta?.total}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
