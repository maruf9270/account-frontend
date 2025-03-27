"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Calendar,
  ChevronsUpDown,
  Save,
  Printer,
  X,
  Plus,
  Search,
  RotateCcw,
} from "lucide-react";
import { useGetAllLedgerQuery } from "@/redux/api/ledger-account/ledger-account.api";
import {
  Button,
  Input,
  Loader,
  Message,
  SelectPicker,
  useToaster,
} from "rsuite";
import {
  useCreateJournalEntryMutation,
  useLazyGetSingleJournalEntryForPrintQuery,
  useLazyGetSingleJournalEntryQuery,
  useUpdateJournalEntryMutation,
} from "@/redux/api/journal-entry/journalEntry.api";
import Swal from "sweetalert2";
import {
  BudgetType,
  journalType,
} from "@/components/journal-entry/journalEntryHelper";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ENUM_MODE } from "@/enums/EnumMode";
import AccountOptionSelector from "@/components/journal-entry/AccountOptionSelector";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generateJournalVoucherPDF } from "@/components/journal-entry/HanldePrint";
import JournalForm from "@/components/journal-entry/JournalForm";
// pdfMake.vfs = pdfFonts.pdfMake;
export interface JournalEntry {
  account: string;
  comment: string;
  debit: number;
  credit: number;
  budgetType?: string;
  entryId?: string;
  journalType?: string;
  createdAt?: string;
  memo?: string;
}

function Journal() {
  const router = useRouter();

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <JournalForm />
      </Suspense>
    </div>
  );
}

export default Journal;
