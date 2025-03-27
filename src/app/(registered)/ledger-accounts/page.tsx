/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChartBarIncreasing,
} from "lucide-react";
import { useGetAllLedgerQuery } from "@/redux/api/ledger-account/ledger-account.api";
import { Button, SelectPicker } from "rsuite";
import { ledgerType } from "@/components/ledger-accounts/ledgerAccountsHelper";
import useQueryBuilder from "@/helpers/QueryBUilder";
import RPagination from "@/components/RPagination";
import { NavLink } from "@/components/layout/Navlink";
import { useRouter } from "next/navigation";
import { ENUM_MODE } from "@/enums/EnumMode";
import ButtonProvider from "@/components/ledger-accounts/ButtonProvider";

// Sample data - in a real app this would come from an API/database

function App() {
  const router = useRouter();
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: ledgerData,
    isLoading: ledgerLoading,
    isFetching: ledgerFetching,
  } = useGetAllLedgerQuery({ ...query });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 gap-3 flex items-center">
              <ChartBarIncreasing />
              All Account Heads
            </h1>
          </div>

          {/* Search and Filter Section */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    onChange={(v) => addField("searchTerm", v.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <SelectPicker
                  data={ledgerType}
                  block={true}
                  onChange={(v) => addField("accountType", v)}
                  onClean={() => deleteField("accountType")}
                />
              </div>
              <div>
                <Button
                  appearance="primary"
                  color="blue"
                  as={NavLink}
                  href="/ledger-accounts/new?mode=new"
                >
                  Add New
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ledgerLoading || ledgerFetching ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : ledgerData?.data?.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  ledgerData?.data?.data.map((account: any) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                        {account?.accountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ButtonProvider id={account._id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <RPagination
              addField={addField}
              deleteField={deleteField}
              query={query}
              total={ledgerData?.data?.meta?.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
