"use client";
import React, { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import { useGetTrialBalanceDataQuery } from "@/redux/api/ledger-account/ledger-account.api";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { printTrialBalance } from "@/components/trial-balance/helper";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePicker } from "rsuite";
pdfMake.vfs = pdfFonts.vfs;

function App() {
  const { addField, deleteField, query } = useQueryBuilder();
  const { data: trialBalanceData, isLoading: tbLoading } =
    useGetTrialBalanceDataQuery({ ...query });

  // Calculate totals based on netBalance and balanceType
  const totalDebit = trialBalanceData?.data?.reduce(
    (sum: any, item: any) =>
      item.balanceType === "DEBIT" ? sum + item.netBalance : sum,
    0
  );

  const totalCredit = trialBalanceData?.data?.reduce(
    (sum: any, item: any) =>
      item.balanceType === "CREDIT" ? sum + item.netBalance : sum,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Trial Balance</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label
                htmlFor="fromDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                From Date
              </label>
              <DatePicker
                id="fromDate"
                value={new Date(query?.from)}
                onChange={(e) => addField("from", e)}
                block
                size="lg"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="toDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                To Date
              </label>
              <DatePicker
                id="toDate"
                value={new Date(query?.to)}
                onChange={(e) => addField("to", e)}
                block
                size="lg"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => printTrialBalance(trialBalanceData?.data)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Printer size={18} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {tbLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Account Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Account Type
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trialBalanceData?.data?.map((item: any, index: any) => (
                    <tr
                      key={item.accountId}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.accountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {item.accountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.balanceType === "DEBIT" && item.netBalance > 0
                          ? formatCurrency(item.netBalance)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.balanceType === "CREDIT" && item.netBalance > 0
                          ? formatCurrency(item.netBalance)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold">
                    <td
                      colSpan={2}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(totalDebit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(totalCredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
