"use client";
import React, { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { useGetIncomeStatementDataQuery } from "@/redux/api/ledger-account/ledger-account.api";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generateIncomeStatementPdf } from "@/components/income-statement/helpers";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { DatePicker } from "rsuite";

pdfMake.vfs = pdfFonts.vfs;

function INcomeStatement() {
  const { addField, deleteField, query } = useQueryBuilder();

  const { data: incomeStatementData } = useGetIncomeStatementDataQuery({
    ...query,
  });

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
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Company name - only visible when printing */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">MAS IT SOLUTIONS</h1>
        <p>House-1/2, Block - JHA, Mirpur - 6, Dhaka - 1216</p>
        <p>01915682291, 01711227051</p>
      </div>

      {/* Controls - hidden when printing */}
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
        <button
          onClick={() => generateIncomeStatementPdf()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Printer size={20} />
          Print
        </button>
      </div>

      {/* Income Statement Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center p-4 border-b">
          <h2 className="text-xl font-semibold">Income Statement</h2>
          <p className="text-gray-600">
            For the period {new Date(query?.from).toLocaleDateString()} to{" "}
            {new Date(query?.to).toLocaleDateString()}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Particulars
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount(Tk)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total(Tk)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Revenue Section */}
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-6 py-3 text-sm font-medium">
                  REVENUE
                </td>
              </tr>
              {incomeStatementData?.data?.revenueAccounts?.map((ra: any) => {
                return (
                  <>
                    <tr>
                      <td className="px-6 py-4 pl-10">{ra?.accountName}</td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-right">{ra?.amount}</td>
                      <td className="px-6 py-4 text-right"></td>
                    </tr>
                  </>
                );
              })}

              <tr className="bg-gray-100">
                <td colSpan={3} className="px-6 py-4 font-medium text-right">
                  Total Revenue
                </td>
                <td className="px-6 py-4 font-medium text-right">
                  {incomeStatementData?.data?.totalRevenue}
                </td>
              </tr>

              {/* Operating Expenses */}
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-6 py-3 text-sm font-medium">
                  EXPENSES
                </td>
              </tr>
              {incomeStatementData?.data?.expenseAccounts?.map((ra: any) => {
                return (
                  <>
                    <tr>
                      <td className="px-6 py-4 pl-10">{ra?.accountName}</td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-right">
                        {ra?.amount * -1}
                      </td>
                      <td className="px-6 py-4 text-right"></td>
                    </tr>
                  </>
                );
              })}
              <tr className="bg-gray-100">
                <td colSpan={3} className="px-6 py-4 font-medium text-right">
                  Total Operating Expenses
                </td>
                <td className="px-6 py-4 font-medium text-right">
                  {" "}
                  {incomeStatementData?.data?.totalExpenses * -1}
                </td>
              </tr>

              {/* Net Income */}
              <tr className="bg-green-50 font-bold">
                <td colSpan={3} className="px-6 py-4 text-right">
                  NET INCOME/LOSS
                </td>
                <td className="px-6 py-4 text-right">
                  {" "}
                  {incomeStatementData?.data?.netIncome}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default INcomeStatement;
