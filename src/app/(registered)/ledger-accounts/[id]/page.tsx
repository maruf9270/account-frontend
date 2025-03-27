"use client";
import React, { useState } from "react";
import { Calendar, Search, RefreshCcw } from "lucide-react";

function App() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-02-01",
    endDate: "2025-02-10",
  });

  const demoData = [
    {
      id: 1,
      date: "2025-02-10",
      particulars: "Jv1",
      description: "Cash in Hand [Tk 5,000.00]",
      debit: 5000.0,
      credit: 0.0,
      regularBudget: true,
    },
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                General Ledger
              </h1>
              <p className="text-gray-500">MAS IT SOLUTIONS</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search records..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-500">Loading records...</p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Particulars
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Debit
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Credit
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Regular Budget
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.particulars}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      {row.debit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      {row.credit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.regularBudget ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-sm font-semibold text-gray-600 text-right"
                  >
                    Total:
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-right">
                    5,000.00
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-right">
                    0.00
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
