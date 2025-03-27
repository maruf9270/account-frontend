import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useRouter } from "next/navigation";
import DeleteButton from "../DeleteWIthDialog";
import { useDeleteLedgerMutation } from "@/redux/api/ledger-account/ledger-account.api";
const ButtonProvider = ({ id }: { id: string }) => {
  const deleteQuery = useDeleteLedgerMutation();
  const router = useRouter();
  return (
    <div className="flex space-x-3">
      <button
        className="text-blue-600 hover:text-blue-800"
        onClick={() =>
          router.push(`/ledger-accounts/new?id=${id}&mode=${ENUM_MODE.VIEW}`)
        }
      >
        <Eye className="h-5 w-5" />
      </button>
      <button
        className="text-green-600 hover:text-green-800"
        onClick={() =>
          router.push(`/ledger-accounts/new?id=${id}&mode=${ENUM_MODE.UPDATE}`)
        }
      >
        <Pencil className="h-5 w-5" />
      </button>
      <DeleteButton id={id} deleteApi={useDeleteLedgerMutation} />
    </div>
  );
};

export default ButtonProvider;
