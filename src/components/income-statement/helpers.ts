import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.vfs;
export const generateIncomeStatementPdf = () => {
  const incomeStatementData = {
    totalRevenue: 1000,
    totalExpenses: -200,
    netIncome: 800,
    revenueAccounts: [
      {
        accountId: "67c23c18edf15adde7689f25",
        accountName: "Income",
        accountType: "income",
        amount: 1000,
      },
    ],
    expenseAccounts: [
      {
        accountId: "67c228ba88672c446e8dbd7f",
        accountName: "Sellery",
        accountType: "expense",
        amount: -200,
      },
    ],
  };

  const docDefinition = {
    content: [
      {
        text: "Income Statement",
        style: "header",
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            // Revenue Section with Background Color
            [
              { text: "Revenue", bold: true, fillColor: "#9b9b9b" },
              { text: "Amount", bold: true, fillColor: "#9b9b9b" },
            ],
            ...incomeStatementData.revenueAccounts.map((account) => [
              account.accountName,
              `$${account.amount}`,
            ]),
            [
              { text: "Total Revenue", bold: true },
              `$${incomeStatementData.totalRevenue}`,
            ],

            // Expenses Section with Background Color
            [
              {
                text: "Expenses",
                bold: true,
                fillColor: "#9b9b9b",
                colSpan: 2,
              },
              "",
            ],
            ...incomeStatementData.expenseAccounts.map((account) => [
              account.accountName,
              `$${account.amount * -1} `,
            ]),
            [
              { text: "Total Expenses", bold: true },
              {
                text: `$${incomeStatementData.totalExpenses * -1}`,
                bold: true,
              },
            ],

            // Net Income Section
            [{ text: "Net Income", bold: true, colSpan: 2 }, ""],
            [{ text: "", colSpan: 2 }, ""], // Empty row for spacing
            [{ text: "", colSpan: 2 }, ""], // Empty row for spacing
            [
              { text: "Net Income", bold: true, alignment: "right" },
              `$${incomeStatementData.netIncome}`,
            ],
          ],
        },
        style: "table",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      table: {
        margin: [0, 5, 0, 20],
      },
    },
  };

  pdfMake.createPdf(docDefinition as unknown as TDocumentDefinitions).open();
};

export const BalanceSheetGenerator = (accounts: any[]) => {
  // Sample data from your JSON

  // Organize accounts by type
  const assetAccounts = accounts.filter((acc) => acc.accountType === "asset");
  const expenseAccounts = accounts.filter(
    (acc) => acc.accountType === "expense"
  );
  const capitalAccounts = accounts.filter(
    (acc) => acc.accountType === "capital"
  );
  const incomeAccounts = accounts.filter((acc) => acc.accountType === "income");
  const liabilityAccounts = accounts.filter(
    (acc) => acc.accountType === "liability"
  );

  // Calculate totals
  const totalAssets = assetAccounts.reduce(
    (sum, acc) => sum + acc.netBalance,
    0
  );
  const totalExpenses = expenseAccounts.reduce(
    (sum, acc) => sum + acc.netBalance,
    0
  );
  const totalCapital = capitalAccounts.reduce(
    (sum, acc) => sum + acc.netBalance,
    0
  );
  const totalIncome = incomeAccounts.reduce(
    (sum, acc) => sum + acc.netBalance,
    0
  );
  const totalLiabilities = liabilityAccounts.reduce(
    (sum, acc) => sum + acc.netBalance,
    0
  );

  // Calculate net profit or loss
  const netProfitOrLoss = totalIncome - totalExpenses;

  // Grand total for each side
  const leftSideTotal =
    totalCapital +
    totalLiabilities +
    (netProfitOrLoss > 0 ? netProfitOrLoss : 0);
  const rightSideTotal =
    totalAssets + (netProfitOrLoss < 0 ? Math.abs(netProfitOrLoss) : 0);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}.${
    currentDate.getMonth() + 1
  }.${currentDate.getFullYear()}`;

  // Define the document definition
  const docDefinition = {
    content: [
      // Header
      { text: "MAS IT SOLUTIONS", style: "header", alignment: "center" },
      {
        text: "House-1/2, Block - JHA, Mirpur - 6, Dhaka - 1216\n01915682291, 01711227051",
        style: "subheader",
        alignment: "center",
      },
      {
        text: `Balance sheet as at ${formattedDate}`,
        style: "balanceDate",
        alignment: "center",
        margin: [0, 10, 0, 10],
      },

      // Balance Sheet Table
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "*", "auto", "auto"],
          body: [
            [
              { text: "Capital & Liabilities", style: "tableHeader" },
              { text: "Note", style: "tableHeader" },
              { text: "Amount(Tk)", style: "tableHeader" },
              { text: "Property & Assets", style: "tableHeader" },
              { text: "Note", style: "tableHeader" },
              { text: "Amount(Tk)", style: "tableHeader" },
            ],
            // Capital accounts
            ...capitalAccounts.map((acc, index) => [
              { text: acc.accountName.toUpperCase(), style: "accountName" },
              { text: (index + 1).toString() },
              { text: acc.netBalance.toFixed(2) },
              index < assetAccounts.length
                ? {
                    text: assetAccounts[index].accountName.toUpperCase(),
                    style: "accountName",
                  }
                : {},
              index < assetAccounts.length
                ? { text: (index + capitalAccounts.length + 1).toString() }
                : {},
              index < assetAccounts.length
                ? { text: assetAccounts[index].netBalance.toFixed(2) }
                : {},
            ]),

            // Net profit/loss
            [
              {
                text: netProfitOrLoss > 0 ? "PROFIT" : "LOSS",
                style: "accountName",
              },
              { text: (capitalAccounts.length + 1).toString() },
              {
                text: netProfitOrLoss > 0 ? netProfitOrLoss.toFixed(2) : "0.00",
              },
              assetAccounts.length > capitalAccounts.length
                ? {
                    text: assetAccounts[
                      capitalAccounts.length
                    ].accountName.toUpperCase(),
                    style: "accountName",
                  }
                : {},
              assetAccounts.length > capitalAccounts.length
                ? { text: (capitalAccounts.length * 2 + 1).toString() }
                : {},
              assetAccounts.length > capitalAccounts.length
                ? {
                    text: assetAccounts[
                      capitalAccounts.length
                    ].netBalance.toFixed(2),
                  }
                : {},
            ],

            // Liability accounts
            ...liabilityAccounts.map((acc, index) => [
              { text: acc.accountName.toUpperCase(), style: "accountName" },
              { text: (capitalAccounts.length + 2 + index).toString() },
              { text: acc.netBalance.toFixed(2) },
              index + capitalAccounts.length + 1 < assetAccounts.length
                ? {
                    text: assetAccounts[
                      index + capitalAccounts.length + 1
                    ].accountName.toUpperCase(),
                    style: "accountName",
                  }
                : {},
              index + capitalAccounts.length + 1 < assetAccounts.length
                ? {
                    text: (
                      capitalAccounts.length +
                      liabilityAccounts.length +
                      2 +
                      index
                    ).toString(),
                  }
                : {},
              index + capitalAccounts.length + 1 < assetAccounts.length
                ? {
                    text: assetAccounts[
                      index + capitalAccounts.length + 1
                    ].netBalance.toFixed(2),
                  }
                : {},
            ]),

            // Display expense accounts if any asset slots left
            ...expenseAccounts.map((acc, index) => {
              const assetIndex =
                index + capitalAccounts.length + liabilityAccounts.length + 1;
              return [
                {},
                {},
                {},
                assetIndex < assetAccounts.length
                  ? {
                      text: assetAccounts[assetIndex].accountName.toUpperCase(),
                      style: "accountName",
                    }
                  : {},
                assetIndex < assetAccounts.length
                  ? {
                      text: (
                        capitalAccounts.length +
                        liabilityAccounts.length +
                        2 +
                        index
                      ).toString(),
                    }
                  : {},
                assetIndex < assetAccounts.length
                  ? { text: assetAccounts[assetIndex].netBalance.toFixed(2) }
                  : {},
              ];
            }),

            // Total row
            [
              { text: "TOTAL", style: "totalRow" },
              {},
              { text: leftSideTotal.toFixed(2), style: "totalRow" },
              { text: "TOTAL", style: "totalRow" },
              {},
              { text: rightSideTotal.toFixed(2), style: "totalRow" },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i: any, node: any) {
            return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0;
          },
          vLineWidth: function (i: any, node: any) {
            return 1;
          },
          hLineColor: function (i: any, node: any) {
            return "black";
          },
          vLineColor: function (i: any, node: any) {
            return "black";
          },
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      subheader: {
        fontSize: 12,
        margin: [0, 0, 0, 5],
      },
      balanceDate: {
        fontSize: 14,
        bold: true,
        decoration: "underline",
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "black",
      },
      accountName: {
        bold: true,
        fontSize: 11,
      },
      totalRow: {
        bold: true,
        fontSize: 12,
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  // Generate the PDF
  pdfMake.createPdf(docDefinition as unknown as TDocumentDefinitions).open();
};
