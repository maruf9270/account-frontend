"use client";
import React, { useState, useEffect } from "react";
import { Edit, Eye, Trash2, Plus, Calendar } from "lucide-react";
import {
  useDeleteVoucherMutation,
  useGetAllVouchersQuery,
} from "@/redux/api/voucher/voucher.api";
import { IVoucher } from "@/components/voucher/voucherHelper";
import useQueryBuilder from "@/helpers/QueryBUilder";
import AccountOptionSelector from "@/components/journal-entry/AccountOptionSelector";
import Link from "next/link";
import RPagination from "@/components/RPagination";

import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/DeleteWIthDialog";

const VoucherTable = () => {
  const router = useRouter();
  const { addField, deleteField, query } = useQueryBuilder();
  const { data: voucherData, isLoading: voucherLoading } =
    useGetAllVouchersQuery({ ...query });

  // Get title based on voucher type
  const getVoucherTitle = (
    voucher: IVoucher & {
      account: { name: string };
      cashOrBankAc: { name: string };
    }
  ) => {
    return voucher.voucherType === "debit"
      ? voucher.account.name
      : voucher.cashOrBankAc.name;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vouchers</h1>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <div className="relative">
              <AccountOptionSelector
                handleChange={(v) => addField("account", v)}
              />
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
            <Link href={"/voucher/new?mode=new"}>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                <Plus className="h-5 w-5" />
                Add New
              </button>
            </Link>
          </div>
        </div>
      </div>

      {voucherLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Serial No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Voucher Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {voucherData?.data?.data?.length > 0 ? (
                  voucherData?.data?.data?.map((voucher: any, index: any) => (
                    <tr
                      key={voucher._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voucher.voucherNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getVoucherTitle(voucher)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            voucher.voucherType === "debit"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {voucher.voucherType.charAt(0).toUpperCase() +
                            voucher.voucherType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        TK. {voucher.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(voucher.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() =>
                              router.push(
                                `/voucher/new?mode=${ENUM_MODE.VIEW}&id=${voucher?._id}`
                              )
                            }
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() =>
                              router.push(
                                `/voucher/new?mode=${ENUM_MODE.UPDATE}&id=${voucher?._id}`
                              )
                            }
                          >
                            <Edit size={18} />
                          </button>
                          <DeleteButton
                            deleteApi={useDeleteVoucherMutation}
                            id={voucher?._id}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No vouchers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4  border-t border-gray-200 w-full">
            <RPagination
              addField={addField}
              deleteField={deleteField}
              query={query}
              total={voucherData?.data?.meta?.total}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VoucherTable;
