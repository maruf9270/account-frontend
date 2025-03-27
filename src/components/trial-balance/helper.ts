import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
pdfMake.vfs = pdfFonts.vfs;

export const printTrialBalance = (data: any[]) => {
  // Calculate total debits and credits
  let totalDebit = 0;
  let totalCredit = 0;

  const tableRows = data.map((account) => {
    const row = [
      account.accountName,
      account.balanceType === "DEBIT" ? account.netBalance : "", // Debit column
      account.balanceType === "CREDIT" ? account.netBalance : "", // Credit column
    ];

    // Add to totals
    if (account.balanceType === "DEBIT") {
      totalDebit += account.netBalance;
    } else if (account.balanceType === "CREDIT") {
      totalCredit += account.netBalance;
    }

    return row;
  });

  // Add totals row
  // tableRows.push([
  //   { text: "Total", bold: true },
  //   totalDebit.toFixed(2),
  //   totalCredit.toFixed(2),
  // ]);

  const docDefinition = {
    content: [
      {
        text: "Account Summary",
        style: "header",
      },
      {
        table: {
          widths: ["*", "auto", "auto"],
          body: [
            // Table headers with background color
            [
              { text: "Account Name", style: "tableHeader" },
              { text: "Debit", style: "tableHeader" },
              { text: "Credit", style: "tableHeader" },
            ],
            // Data rows
            ...tableRows,
            // Total row with background color
            [
              { text: "Total", style: "totalCell" },
              { text: totalDebit.toFixed(2), style: "totalCell" },
              { text: totalCredit.toFixed(2), style: "totalCell" },
            ],
          ],
        },
        layout: "lightHorizontalLines", // Use a predefined layout for table rows
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: "center",
      },
      tableHeader: {
        fontSize: 12,
        bold: true,
        fillColor: "#4CAF50", // Green background color for the header
        color: "white",
        padding: [10, 10, 10, 10], // Padding inside the table header cells
      },
      totalCell: {
        fontSize: 12,
        bold: true,
        fillColor: "#f7a8b8", // Light pink background color for the total row
        color: "black",
        padding: [10, 10, 10, 10], // Padding inside the total row cells
        alignment: "center",
      },
    },
  };

  // Create PDF
  pdfMake.createPdf(docDefinition as unknown as TDocumentDefinitions).open();
};
