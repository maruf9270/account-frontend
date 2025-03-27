/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from "react";
import OptionSelector from "../OptionSelector";
import { useGetAllLedgerQuery } from "@/redux/api/ledger-account/ledger-account.api";
import useQueryBuilder from "@/helpers/QueryBUilder";
const AccountOptionSelector = ({
  handleChange,
  defaultValue,
  size,
}: {
  handleChange(v: string): void;
  defaultValue?: string;
  size?: "lg" | "sm";
}) => {
  const { addField, query } = useQueryBuilder();
  const {
    data: accounts,
    isLoading,
    isFetching,
  } = useGetAllLedgerQuery({ limit: 100, ...query });

  const [value, setValue] = useState<string | undefined>(defaultValue);

  // Only call handleChange when user selects a value, not on re-renders
  const handleValueChange = (v: string) => {
    setValue(v);
    handleChange(v); // Call parent state update only when user makes a selection
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]); // Runs only when defaultValue changes

  useEffect(() => {
    addField("limit", 100);
  }, []);
  return (
    <OptionSelector
      onChange={(v) => handleValueChange(v as string)}
      searchPlaceholder="Search By Account Name"
      placeholder="Select Account"
      onLoadMore={() => addField("limit", query?.limit ?? 0 + 20)}
      options={accounts?.data?.data?.map((account: any) => ({
        label: account?.name,
        value: account?._id?.toString(),
      }))}
      isLoading={isLoading || isFetching}
      onSearch={(v) => addField("searchTerm", v)}
      value={value}
      size={size}
    />
  );
};

export default AccountOptionSelector;
