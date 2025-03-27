"use client";
import Container from "@/components/Container";
import {
  initialLedgerFormVlaue,
  ledgerModel,
  ledgerType,
} from "@/components/ledger-accounts/ledgerAccountsHelper";
import LedgerForm from "@/components/ledger-accounts/LedgerForm";
import { RFrom } from "@/components/RForm";
import RFormField from "@/components/RFormField";
import TextArea from "@/components/TextArea";
import { useRForm } from "@/components/useRForm";
import { ENUM_MODE } from "@/enums/EnumMode";

import { ChartBarIncreasing } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Button, DatePicker, Loader, SelectPicker } from "rsuite";
import Swal from "sweetalert2";

const NewLedger = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <LedgerForm />
      </Suspense>
    </>
  );
};

export default NewLedger;
