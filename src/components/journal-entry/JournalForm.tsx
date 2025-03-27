import React, { useEffect, useState } from "react";
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
import { Button, Input, Message, SelectPicker, useToaster } from "rsuite";
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
import { JournalEntry } from "@/app/(registered)/journal/new/page";
const JournalForm = () => {
  const searchParams = useSearchParams();
  const entryId = searchParams.get("entryId");
  const mode = searchParams.get("mode");
  const router = useRouter();
  // Sample account list - in a real app, this would come from your backend
  const { data: ledgerData, isLoading: ledgerDataLoading } =
    useGetAllLedgerQuery({ limit: 50 });
  const [post, { isLoading: postLoading }] = useCreateJournalEntryMutation();
  const [getSingle] = useLazyGetSingleJournalEntryQuery();
  const [update, { isLoading: updateLoading }] =
    useUpdateJournalEntryMutation();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      account: "",
      comment: "",
      debit: 0,
      credit: 0,
      journalType: "general",
      budgetType: "regularBudget",
    },
  ]);
  const [getForPrint] = useLazyGetSingleJournalEntryForPrintQuery();

  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

  const addNewEntry = () => {
    setEntries([
      ...entries,
      {
        account: "",
        comment: "",
        debit: 0,
        credit: 0,
        journalType: entries[0].journalType,
        budgetType: entries[0].budgetType,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
    }
  };

  const handlemandatoryDataforEntry = (fieldName: string, value: string) => {
    if (entries?.length) {
      const newEntries = entries.map((entry) => ({
        ...entry,
        [fieldName]: value,
      }));
      setEntries(newEntries);
    }
  };

  const toaster = useToaster();

  const submitHandler = async () => {
    if (entries.length < 2) {
      toaster.push(
        <Message type="error">
          Minimum two entries are required for a journal entry.
        </Message>
      );
      return;
    }
    if (entries.some((entry) => !entry.account)) {
      toaster.push(
        <Message type="error">Please fill in all mandatory fields.</Message>
      );
      return;
    }
    if (totalDebit !== totalCredit) {
      toaster.push(
        <Message type="error">
          Total debit and credit amounts should be equal.
        </Message>
      );
      return;
    }

    try {
      if (mode == ENUM_MODE.NEW) {
        const result = await post(entries).unwrap();
        if (result.success) {
          Swal.fire("Success", "Journal Entry Created successfully", "success");
          router.push(`/journal`);
          console.log(result);
        }
      }
      if (mode == ENUM_MODE.UPDATE) {
        const result = await update({
          data: entries,
          entryId: entryId,
        }).unwrap();
        console.log(result);
        if (result.success) {
          Swal.fire("Success", "Journal Entry updated successfully", "success");
          router.push(`/journal`);
        }
      }

      if (mode == ENUM_MODE.VIEW) {
        setEntries([]);
        router.push("/journal");
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toaster.push(
        <Message type="error">
          An error occurred while creating the journal entry.
        </Message>
      );
    }
  };

  useEffect(() => {
    (async function () {
      if (mode !== ENUM_MODE.NEW && entryId) {
        const result = await getSingle(entryId).unwrap();
        if (result.success) {
          const copiedData = JSON.parse(JSON.stringify(result.data));
          setEntries(copiedData);
        }
      } else return;
    })();
  }, [mode, entryId, getSingle]);

  const handlePrint = async () => {
    if (mode !== ENUM_MODE.NEW) {
      const data = await getForPrint(entryId as string).unwrap();
      if (data?.success) {
        const copiedData = JSON.parse(JSON.stringify(data?.data));
        generateJournalVoucherPDF(copiedData);
      }
    }
  };

  if (!router) {
    return <div>loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={
                    entries.length && mode !== ENUM_MODE.NEW
                      ? new Date(
                          entries[0]?.createdAt as string
                        ).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }
                  disabled
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Journal Type
              </label>
              <div className="relative">
                <SelectPicker
                  className=""
                  size="lg"
                  block
                  searchable={false}
                  onChange={(v) =>
                    handlemandatoryDataforEntry("journalType", v as string)
                  }
                  data={journalType}
                  value={entries.length && entries[0]?.journalType}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Budget Type
              </label>
              <div className="relative">
                <SelectPicker
                  className=""
                  size="lg"
                  block
                  searchable={false}
                  onChange={(v) =>
                    handlemandatoryDataforEntry("budgetType", v as string)
                  }
                  data={BudgetType}
                  value={entries.length && entries[0]?.budgetType}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Journal Entries Table */}
        <div className="overflow-x-visible">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Head of Accounts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap z-50">
                    <AccountOptionSelector
                      handleChange={(v) => {
                        const newEntries = [...entries];
                        newEntries[index].account = v as string;
                        setEntries(newEntries);
                      }}
                      defaultValue={entry?.account}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      type="text"
                      value={entry.comment}
                      className="w-full border-0 focus:ring-0"
                      placeholder="Enter comment..."
                      onChange={(e) => {
                        const newEntries = [...entries];
                        newEntries[index].comment = e as string;
                        setEntries(newEntries);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Input
                      type="number"
                      value={entry.debit}
                      className="w-full text-right border-0 focus:ring-0"
                      onChange={(e) => {
                        const newEntries = [...entries];
                        newEntries[index].debit = Number(e);
                        setEntries(newEntries);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Input
                      type="number"
                      value={entry.credit}
                      className="w-full text-right border-0 focus:ring-0"
                      onChange={(e) => {
                        const newEntries = [...entries];
                        newEntries[index].credit = Number(e);
                        setEntries(newEntries);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {entries.length > 1 && (
                      <button
                        onClick={() => removeEntry(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-right font-medium">
                  Total:
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {totalDebit.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {totalCredit.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Memo Section */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memo
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              onChange={(e) =>
                handlemandatoryDataforEntry("memo", e.target.value as string)
              }
              value={entries.length && entries[0]?.memo}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
          {mode !== ENUM_MODE.VIEW ? (
            <>
              <div className="flex space-x-2">
                <button
                  onClick={addNewEntry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  appearance="primary"
                  color="green"
                  loading={postLoading || updateLoading}
                  onClick={() => submitHandler()}
                >
                  {" "}
                  <Save className="h-4 w-4" />
                  Save
                </Button>

                {mode !== ENUM_MODE.NEW && (
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    onClick={() => handlePrint()}
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  onClick={() => redirect("/journal")}
                >
                  <X className="h-4 w-4" />
                  Back
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-end justify-end w-full">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                onClick={() => redirect("/journal")}
              >
                <X className="h-4 w-4" />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalForm;
