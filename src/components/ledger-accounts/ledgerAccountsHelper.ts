import { Schema } from "rsuite";
const {
  ArrayType,
  BooleanType,
  DateType,
  MixedType,
  NumberType,
  ObjectType,
  StringType,
} = Schema.Types;

export const ledgerType = [
  { label: "Assets", value: "asset" },
  { label: "Liability", value: "liability" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
  { label: "Drawing", value: "drawing" },
  { label: "Capital", value: "capital" },
];

export const ledgerModel = Schema.Model({
  name: StringType().isRequired("Name is required"),
  accountType: StringType().isRequired("Name is required"),
});

export const initialLedgerFormVlaue = {
  BDDate: new Date(),
  balanceBD: 0,
};

export const balanceType = [
  { label: "Cash", value: "cash" },
  { label: "Bank", value: "bank" },
];
