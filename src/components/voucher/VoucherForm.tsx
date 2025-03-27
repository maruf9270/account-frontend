"use client";
import TextImageIcon from "@rsuite/icons/TextImage";
import CalendarIcon from "@rsuite/icons/Calendar";
import React, { useEffect, useRef, useState } from "react";
import CreditCardPlusIcon from "@rsuite/icons/CreditCardPlus";
import { Type, Banknote } from "lucide-react";
import { DatePicker, Form, SelectPicker, useToaster } from "rsuite";
import TextArea from "@/components/TextArea";
import AccountOptionSelector from "@/components/journal-entry/AccountOptionSelector";
import {
  IVoucher,
  paymentMode,
  voucherType,
} from "@/components/voucher/voucherHelper";
import { BudgetType } from "@/components/journal-entry/journalEntryHelper";
import {
  useCreateVoucherMutation,
  useLazyGetSingleVoucherQuery,
} from "@/redux/api/voucher/voucher.api";
import Swal from "sweetalert2";
import { ledgerModel } from "@/components/ledger-accounts/ledgerAccountsHelper";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  useGetAllLedgerQuery,
  useLazyGetSingleLedgerQuery,
} from "@/redux/api/ledger-account/ledger-account.api";
const VoucherForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const ref = useRef<any>(undefined);
  const [formData, setFormData] = useState<IVoucher | Record<string, string>>({
    account: "",
    budgetType: "regularBudget",
  } as IVoucher);
  const [post, { isLoading }] = useCreateVoucherMutation();
  const [get, { isLoading: voucherLoading }] = useLazyGetSingleVoucherQuery();

  const [
    getLedger,
    { isLoading: singleLedgerLoading, isFetching: singleLedgerFetching },
  ] = useLazyGetSingleLedgerQuery();
  const {
    data: balanceData,
    isLoading: balanceDataLoading,
    isFetching: isBalanceFetching,
  } = useGetAllLedgerQuery(
    {
      limit: 10,
      ...(formData?.paymentMode ? { balanceType: formData?.paymentMode } : {}),
    },
    { skip: !formData?.paymentMode }
  );

  const handleSubmit = async () => {
    if (!formData.account || !formData.cashOrBankAc || ref?.current?.check()) {
      Swal.fire("Error", "Please Fill out the fields", "error");
      return;
    } else {
      try {
        const result = await post(formData).unwrap();
        if (result?.success) {
          Swal.fire("Success", "Voucher Created Successfully", "success");
          router.push(`/voucher`);
        }
      } catch (error) {
        Swal.fire("Error", "Invalid document", "error");
      }
    }
  };

  useEffect(() => {
    if (mode !== ENUM_MODE.NEW) {
      (async function () {
        const result = await get(id as string).unwrap();
        if (result?.success) {
          const copiedData = JSON.parse(JSON.stringify(result.data[0]));
          setFormData({
            ...copiedData,
            account: copiedData?.account?.toString(),
            cashOrBankAc: copiedData?.cashOrBankAc?.toString(),
          });
        }
      })();
    }
  }, [searchParams, mode, get, id]);

  const handleVoucherTypeChange = async (id: string) => {
    try {
      if (id) {
        const ledger = await getLedger(id).unwrap();
        if (ledger && ledger?.data && ledger?.data?.accountType) {
          if (
            ledger?.data?.accountType == "asset" ||
            ledger?.data?.accountType == "expense"
          ) {
            setFormData({ ...formData, voucherType: "debit", account: id });
          } else {
            setFormData({ ...formData, voucherType: "credit", account: id });
          }
        } else {
          return;
        }
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <div className=" mx-auto bg-white rounded-xl shadow-lg p-8 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TextImageIcon className="h-6 w-6" />
          Voucher Entry
        </h1>

        <Form
          className="space-y-6"
          fluid
          onChange={setFormData}
          ref={ref}
          model={ledgerModel}
          formValue={formData}
        >
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Group>
              <Form.ControlLabel className=" text-sm font-medium text-gray-700 mb-1 !flex !items-center !gap-1">
                Voucher No.
              </Form.ControlLabel>
              <Form.Control name="voucherNo" disabled size="lg" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                Head of Accounts
              </Form.ControlLabel>
              <AccountOptionSelector
                defaultValue={formData?.account?.toString()}
                handleChange={(v) => {
                  setFormData({ ...formData, account: v });

                  handleVoucherTypeChange(v);
                }}
                size="sm"
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                Voucher Type
              </Form.ControlLabel>
              <Form.Control
                name="voucherType"
                accepter={SelectPicker}
                placeholder="Select Voucher Type"
                block
                data={voucherType}
                size="lg"
                loading={singleLedgerLoading || singleLedgerFetching}
              />
            </Form.Group>
          </div>

          {/* Date, Voucher, Amount Row */}

          {/* Payment Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Group>
              <Form.ControlLabel className=" text-sm font-medium text-gray-700 mb-1 !flex !items-center !gap-1">
                <Banknote className="h-4 w-4" />
                Payment Mode
              </Form.ControlLabel>
              <Form.Control
                name="paymentMode"
                block
                accepter={SelectPicker}
                data={paymentMode}
                size="lg"
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel className=" text-sm font-medium text-gray-700 mb-1 !flex !items-center !gap-1">
                Available Bank/Cash Accounts
              </Form.ControlLabel>
              <Form.Control
                name="cashOrBankAc"
                block
                data={balanceData?.data?.data?.map(
                  (bd: { name: string; _id: string }) => ({
                    label: bd?.name,
                    value: bd?._id,
                  })
                )}
                accepter={SelectPicker}
                size="lg"
                loading={balanceDataLoading || isBalanceFetching}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel className=" text-sm font-medium text-gray-700 mb-1 !flex !items-center !gap-1">
                Budget Type
              </Form.ControlLabel>
              <Form.Control
                name="budgetType"
                block
                data={BudgetType}
                accepter={SelectPicker}
                size="lg"
              />
            </Form.Group>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Form.Group>
                <Form.ControlLabel className=" text-sm font-medium text-gray-700 mb-1 !flex !items-center !gap-1">
                  <CreditCardPlusIcon className="h-4 w-4" />
                  Amount
                </Form.ControlLabel>
                <Form.Control
                  name="amount"
                  block={"true"}
                  type="number"
                  size="lg"
                />
              </Form.Group>
            </div>
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <Form.Group>
              <Form.ControlLabel className=" text-sm font-medium text-gray-700 mb-1 !flex !items-center !gap-1">
                <Type className="h-4 w-4" />
                Description
              </Form.ControlLabel>
              <Form.Control name="description" accepter={TextArea} size="lg" />
            </Form.Group>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => handleSubmit()}
            >
              Save
            </button>

            {/* <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Print
            </button> */}
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => router.push("/voucher")}
            >
              Cancel
            </button>
          </div>
        </Form>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 ${
              formData?._id
                ? "bg-green-400 text-white"
                : "bg-yellow-400 text-yellow-800"
            }  rounded-full text-sm font-medium`}
          >
            {formData?._id ? "Posted" : "Not Posted"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoucherForm;
