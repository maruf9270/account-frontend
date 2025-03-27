export const voucherType = [
  { label: "Debit", value: "debit" },
  { label: "Credit", value: "credit" },
];

export interface IVoucher {
  account: string;
  cashOrBankAc: string;
  voucherType: string;
  date: Date;
  voucherNo: string;
  amount: number;
  paymentMode: string;
  bankOrCashAccount: string;
  budgetType: string;
  description?: string;
  serialNo: string;
  journalRef: string;
  _id: string;
}

import { Schema } from "rsuite";
const { StringType } = Schema.Types;
export const paymentMode = [
  { label: "Cash", value: "cash" },
  { label: "Bank", value: "bank" },
];
export const voucherModel = Schema.Model({
  voucherType: StringType().isRequired("voucher Type is required"),
  paymentMode: StringType().isRequired("payment Mode is required"),
  budgetType: StringType().isRequired("budget Type Mode is required"),
  amount: StringType().isRequired("amount Mode is required"),
});
