"use client";
import TextImageIcon from "@rsuite/icons/TextImage";
import CalendarIcon from "@rsuite/icons/Calendar";
import React, { Suspense, useEffect, useRef, useState } from "react";
import CreditCardPlusIcon from "@rsuite/icons/CreditCardPlus";
import { Type, Banknote } from "lucide-react";
import { DatePicker, Form, Loader, SelectPicker, useToaster } from "rsuite";
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
import VoucherForm from "@/components/voucher/VoucherForm";

const Voucher = () => {
  return (
    <Suspense fallback={<Loader />}>
      <VoucherForm />
    </Suspense>
  );
};

export default Voucher;
