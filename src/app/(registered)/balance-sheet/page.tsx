/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Printer } from "lucide-react";
import { useGetTrialBalanceDataQuery } from "@/redux/api/ledger-account/ledger-account.api";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { BalanceSheetGenerator } from "@/components/income-statement/helpers";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePicker } from "rsuite";
pdfMake.vfs = pdfFonts.vfs;
function App() {
  // State for date range
  const { addField, deleteField, query } = useQueryBuilder();

  // Account data
  const { data: trialBalanceData } = useGetTrialBalanceDataQuery({ ...query });
  console.log(trialBalanceData);
  // Group accounts by type
  const assets = trialBalanceData?.data?.filter(
    (account: any) => account.accountType === "asset"
  );
  const expenses = trialBalanceData?.data?.filter(
    (account: any) => account.accountType === "expense"
  );
  const liabilities = trialBalanceData?.data?.filter(
    (account: any) => account.accountType === "liability"
  );
  const capital = trialBalanceData?.data?.filter(
    (account: any) => account.accountType === "capital"
  );
  const income = trialBalanceData?.data?.filter(
    (account: any) => account.accountType === "income"
  );

  // Calculate totals
  const totalAssets = assets?.reduce(
    (sum: any, account: any) => sum + account.netBalance,
    0
  );
  const totalExpenses = expenses?.reduce(
    (sum: any, account: any) => sum + account.netBalance,
    0
  );
  const totalLiabilities = liabilities?.reduce(
    (sum: any, account: any) => sum + account.netBalance,
    0
  );
  const totalCapital = capital?.reduce(
    (sum: any, account: any) => sum + account.netBalance,
    0
  );
  const totalIncome = income?.reduce(
    (sum: any, account: any) => sum + account.netBalance,
    0
  );

  // Calculate net income/loss
  const netIncome = totalIncome - totalExpenses;

  // Calculate total for each side of the balance sheet
  const totalDebitSide = totalAssets + totalExpenses;
  const totalCreditSide = totalLiabilities + totalCapital + totalIncome;

  // Format date for the balance sheet
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Handle print function

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Date Selection and Print Button */}
        <div className="p-4 bg-gray-100 flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <DatePicker
                  className=""
                  value={new Date(query?.from ?? new Date())}
                  onChange={(e) =>
                    addField("from", e?.toISOString().substring(0, 10))
                  }
                  oneTap
                  format="dd/MM/yyyy"
                  size="lg"
                  block
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <DatePicker
                  className=""
                  value={new Date(query?.to ?? new Date())}
                  onChange={(e) =>
                    addField("to", e?.toISOString().substring(0, 10))
                  }
                  oneTap
                  format="dd/MM/yyyy"
                  size="lg"
                  block
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => BalanceSheetGenerator(trialBalanceData?.data)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors print:hidden"
          >
            <Printer size={18} />
            <span>Print</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center py-6 ">
          <h2 className="text-xl mt-4 font-semibold">
            Balance Sheet as at{" "}
            {query?.from && query?.to
              ? `${new Date(query?.from).toLocaleDateString()} - ${new Date(
                  query?.to
                ).toLocaleDateString()}`
              : formattedDate}
          </h2>
        </div>

        {/* Balance Sheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left w-1/4">
                  Capital & Liabilities
                </th>
                <th className="border px-4 py-2 text-left w-1/4">
                  Amount (Tk)
                </th>
                <th className="border px-4 py-2 text-left w-1/4">
                  Property & Assets
                </th>
                <th className="border px-4 py-2 text-left w-1/4">
                  Amount (Tk)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Capital Section */}
              {capital?.map((account: any, index: any) => (
                <tr key={account?.accountId}>
                  <td className="border px-4 py-2 font-medium">
                    {account?.accountName}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {account?.netBalance.toFixed(2)}
                  </td>
                  {index === 0 && assets?.length > 0 ? (
                    <>
                      <td className="border px-4 py-2 font-medium">
                        {assets[0].accountName}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {assets[0].netBalance?.toFixed(2)}
                      </td>
                    </>
                  ) : index < assets?.length ? (
                    <>
                      <td className="border px-4 py-2 font-medium">
                        {assets[index].accountName}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {assets[index].netBalance?.toFixed(2)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2"></td>
                    </>
                  )}
                </tr>
              ))}

              {/* Net Income/Loss */}
              <tr>
                <td className="border px-4 py-2 font-medium">
                  {netIncome >= 0 ? "Net Profit" : "Net Loss"}
                </td>
                <td className="border px-4 py-2 text-right">
                  {Math.abs(netIncome)?.toFixed(2)}
                </td>
                {capital?.length < assets?.length &&
                capital?.length < assets?.length ? (
                  <>
                    <td className="border px-4 py-2 font-medium">
                      {assets[capital?.length].accountName}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {assets[capital?.length].netBalance?.toFixed(2)}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                  </>
                )}
              </tr>

              {/* Liabilities Section */}
              {liabilities?.map((account: any, index: any) => (
                <tr key={account.accountId}>
                  <td className="border px-4 py-2 font-medium">
                    {account.accountName}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {account.netBalance?.toFixed(2)}
                  </td>
                  {capital?.length + 1 + index < assets.length ? (
                    <>
                      <td className="border px-4 py-2 font-medium">
                        {assets[capital?.length + 1 + index].accountName}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {assets[
                          capital?.length + 1 + index
                        ].netBalance?.toFixed(2)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2"></td>
                    </>
                  )}
                </tr>
              ))}

              {/* Fill remaining asset rows if any */}
              {assets
                ?.slice(capital?.length + liabilities?.length + 1)
                ?.map((account: any) => (
                  <tr key={account.accountId}>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2 font-medium">
                      {account.accountName}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {account.netBalance?.toFixed(2)}
                    </td>
                  </tr>
                ))}

              {/* Totals Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="border px-4 py-2">Total</td>
                <td className="border px-4 py-2 text-right">
                  {(totalCapital + Math.abs(netIncome))?.toFixed(2)}
                </td>
                <td className="border px-4 py-2">Total</td>
                <td className="border px-4 py-2 text-right">
                  {totalAssets?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
