"use client";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { useGetLedgerBalanceQuery } from "@/redux/api/ledger-account/ledger-account.api";
import { Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DatePicker } from "rsuite";

const SingleAccount = () => {
  const params = useParams();
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: ledgerBalanceData,
    isLoading: ledgerBalanceLoading,
    isFetching: ledgerBalanceFetching,
  } = useGetLedgerBalanceQuery({ id: params?.id, params: query });

  function getCurrentAndOneYearBefore() {
    const today = new Date();

    // Format today's date as YYYY-MM-DD
    const formattedToday = today.toISOString().split("T")[0];

    // Get one year before today
    const oneYearBefore = new Date();
    oneYearBefore.setFullYear(today.getFullYear() - 1);
    const formattedOneYearBefore = oneYearBefore.toISOString().split("T")[0];

    return {
      today: formattedToday,
      oneYearBefore: formattedOneYearBefore,
    };
  }

  useEffect(() => {
    if (addField) {
      const { today, oneYearBefore } = getCurrentAndOneYearBefore();
      addField("to", today);
      addField("from", oneYearBefore);
    }
  }, []);
  const entries = [
    {
      entryId: "67c26743edf15adde768a097",
      serialNo: 1,
      date: "2025-03-01",
      debit: 0,
      credit: 1000,
      balance: 2000,
      account: "Cash",
    },
    {
      entryId: "67c26799edf15adde768a09f",
      serialNo: 2,
      date: "2025-03-01",
      debit: 0,
      credit: 100,
      balance: 2100,
      account: "Cash",
    },
    {
      entryId: "67c267ccedf15adde768a0a9",
      serialNo: 3,
      date: "2025-03-01",
      debit: 0,
      credit: 10,
      balance: 2110,
      account: "Cash",
    },
    {
      entryId: "67c26a2eedf15adde768a0f2",
      serialNo: 4,
      date: "2025-03-01",
      debit: 0,
      credit: 10000,
      balance: 12110,
      account: "Cash",
    },
    {
      entryId: "67c271c6457f92e7eb7bd0f8",
      serialNo: 5,
      date: "2025-03-01",
      debit: 0,
      credit: 10000,
      balance: 22110,
      account: "Cash",
    },
    {
      entryId: "67c271c9457f92e7eb7bd0ff",
      serialNo: 6,
      date: "2025-03-01",
      debit: 0,
      credit: 10000,
      balance: 32110,
      account: "Cash",
    },
    {
      entryId: "67c2720f457f92e7eb7bd107",
      serialNo: 7,
      date: "2025-03-01",
      debit: 0,
      credit: 10000,
      balance: 42110,
      account: "Cash",
    },
    {
      entryId: "67c27212457f92e7eb7bd10e",
      serialNo: 8,
      date: "2025-03-01",
      debit: 0,
      credit: 10000,
      balance: 52110,
      account: "Cash",
    },
    {
      entryId: "67c4448af8f13f4ce51c52d0",
      serialNo: 9,
      date: "2025-03-02",
      debit: 0,
      credit: 10000,
      balance: 62110,
      account: "Cash",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  console.log(ledgerBalanceData);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
              General Journal
            </h1>
            <div className="print:hidden mb-8 flex items-center gap-4 justify-between bg-white p-4 rounded-lg shadow">
              <div className="flex gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <DatePicker
                    id="startDate"
                    value={new Date(query?.from)}
                    onChange={(e) => addField("from", e)}
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    block
                    oneTap
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <DatePicker
                    id="endDate"
                    value={new Date(query?.to)}
                    onChange={(e) => addField("to", e)}
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    block
                    oneTap
                  />
                </div>
              </div>
              {/* <button
                // onClick={() => generateIncomeStatementPdf()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Printer size={20} />
                Print
              </button> */}
            </div>
          </div>

          {/* Journal Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Serial No.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Particulars
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Debit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Credit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr key={ledgerBalanceData?.data?.startingBalance}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(query.from).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ledgerBalanceData?.data?.account}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(ledgerBalanceData?.data?.startingBalance)}
                  </td>
                </tr>
                {ledgerBalanceData?.data?.entries?.map((entry: any) => (
                  <tr key={entry.entryId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry?.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry?.serialNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry?.account}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(entry?.debit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(entry?.credit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(entry?.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    Totals
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(
                      ledgerBalanceData?.data?.entries?.reduce(
                        (sum: any, entry: any) => sum + entry.debit,
                        0
                      )
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(
                      ledgerBalanceData?.data?.entries?.reduce(
                        (sum: any, entry: any) => sum + entry.credit,
                        0
                      )
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(
                      ledgerBalanceData?.data?.entries[
                        ledgerBalanceData?.data?.entries?.length - 1
                      ]?.balance || 0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAccount;
