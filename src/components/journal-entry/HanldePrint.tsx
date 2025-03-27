/* eslint-disable @typescript-eslint/no-explicit-any */
import { JournalEntry } from "@/app/(registered)/journal/new/page";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.vfs;

export const generateJournalVoucherPDF = (entries: any) => {
  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${
      date.getHours() % 12 || 12
    }:${date.getMinutes()}:${date.getSeconds()} ${
      date.getHours() >= 12 ? "PM" : "AM"
    }`;
  };

  // Extract journal details
  const journalNo = entries[0]?.journalNo || "N/A";
  const date = formatDate(entries[0]?.createdAt as string);
  const memo = entries[0]?.memo || "N/A";

  // Create table rows
  const tableRows: any = entries.map((entry: any) => [
    { text: entry.account?.name, fontSize: 10 },
    { text: entry.comment || "", fontSize: 10 },
    {
      text: entry.debit ? entry.debit.toFixed(2) : "",
      fontSize: 10,
      alignment: "right",
    },
    {
      text: entry.credit ? entry.credit.toFixed(2) : "",
      fontSize: 10,
      alignment: "right",
    },
  ]);

  // Calculate totals
  const totalDebit: any = entries
    .reduce((sum: any, entry: any) => sum + entry.debit, 0)
    .toFixed(2);
  const totalCredit = entries
    .reduce((sum: any, entry: any) => sum + entry.credit, 0)
    .toFixed(2);

  tableRows.push([
    { text: "" },
    { text: "Total", bold: true, fontSize: 10 },
    { text: totalDebit, bold: true, fontSize: 10, alignment: "right" },
    { text: totalCredit, bold: true, fontSize: 10, alignment: "right" },
  ]);

  const docDefinition = {
    content: [
      {
        text: "Journal Voucher",
        fontSize: 14,
        bold: true,
        alignment: "center",
        decoration: "underline",
        margin: [0, 0, 0, 10],
      },
      { text: `Journal No: ${journalNo}`, fontSize: 10, margin: [0, 0, 0, 5] },
      { text: `Date: ${date}`, fontSize: 10, margin: [0, 0, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ["40%", "30%", "15%", "15%"],
          body: [
            [
              { text: "Particulars", bold: true },
              { text: "Comment", bold: true },
              { text: "Debit", bold: true, alignment: "right" },
              { text: "Credit", bold: true, alignment: "right" },
            ],
            ...tableRows,
          ],
        },
        margin: [0, 5, 0, 10],
      },
      { text: `Memo: ${memo} `, fontSize: 10, margin: [0, 10, 0, 10] },
      {
        columns: [
          {
            text: "Prepared by",
            fontSize: 10,
            alignment: "center",
            margin: [0, 40, 0, 0],
          },
          {
            text: "Approved by",
            fontSize: 10,
            alignment: "center",
            margin: [0, 40, 0, 0],
          },
          {
            text: "Received by",
            fontSize: 10,
            alignment: "center",
            margin: [0, 40, 0, 0],
          },
        ],
      },
      {
        text: formatDate(new Date().toISOString() as string),
        fontSize: 10,
        margin: [0, 10, 0, 0],
      },
    ],
  };

  pdfMake.createPdf(docDefinition as TDocumentDefinitions).open();
};
