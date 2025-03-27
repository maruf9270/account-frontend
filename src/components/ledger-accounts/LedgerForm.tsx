import React from "react";
import Container from "@/components/Container";
import {
  balanceType,
  initialLedgerFormVlaue,
  ledgerModel,
  ledgerType,
} from "@/components/ledger-accounts/ledgerAccountsHelper";
import { RFrom } from "@/components/RForm";
import RFormField from "@/components/RFormField";
import TextArea from "@/components/TextArea";
import { useRForm } from "@/components/useRForm";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  useCreateLedgerMutation,
  useLazyGetSingleLedgerQuery,
  useUpdateLedgerMutation,
} from "@/redux/api/ledger-account/ledger-account.api";
import { ChartBarIncreasing } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button, Checkbox, DatePicker, Radio, SelectPicker } from "rsuite";
import Swal from "sweetalert2";
import { useGetAllAccountCategoryQuery } from "@/redux/api/account-category/ledger-account.api";

const LedgerForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const { formValue, setFormValue, submitHandler, forwardedRef } = useRForm({
    mode: ENUM_MODE.NEW,
    defaultFormValue: initialLedgerFormVlaue,
  });
  const router = useRouter();
  const [post, { isLoading: postLoading }] = useCreateLedgerMutation();
  const [update, { isLoading: updateLoading }] = useUpdateLedgerMutation();
  const [getSingle, { isLoading: singleLoading }] =
    useLazyGetSingleLedgerQuery();
  const { data: accountCategoryData } = useGetAllAccountCategoryQuery({
    limit: 500,
    ...(formValue?.accountType ? { accountType: formValue?.accountType } : {}),
  });

  const hanldeSubmit = async () => {
    if (!forwardedRef?.current?.check()) {
      Swal.fire("Error", "Fill Out the form field", "error");
      return;
    }
    try {
      switch (mode) {
        case ENUM_MODE.NEW:
          const result = await post(formValue).unwrap();
          if (result.success) {
            Swal.fire(
              "Success",
              "Chart of Account Created successfully",
              "success"
            );
            setFormValue(initialLedgerFormVlaue);
            router.push(`/ledger-accounts`);
          }
          break;

        case ENUM_MODE.UPDATE:
          const updateResult = await update({ ...formValue, _id: id }).unwrap();
          if (updateResult.success) {
            Swal.fire(
              "Success",
              "Chart of Account Updated successfully",
              "success"
            );
            setFormValue(initialLedgerFormVlaue);
            router.push(`/ledger-accounts`);
          }
          break;
      }
    } catch (error) {
      Swal.fire("Error", (error ?? "Something went wrong") as string, "error");
    }
  };

  useEffect(() => {
    if (mode !== ENUM_MODE.NEW && id) {
      (async () => {
        const data = await getSingle(id as string).unwrap();
        if (data?.success) {
          const copiedData = JSON.parse(JSON.stringify(data?.data));
          setFormValue({
            ...copiedData,
            BDDate: new Date(copiedData.BDDate),
          });
        }
      })();
    }
  }, [id, mode]);

  return (
    <Container>
      <div className=" text-3xl font-semibold flex gap-2 items-center  py-2 px-3">
        New Account Head
      </div>
      <RFrom
        formValue={formValue}
        mode={mode as ENUM_MODE}
        forwardedRef={forwardedRef}
        setFormValue={setFormValue}
        fluid
        model={ledgerModel}
      >
        {singleLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 p-10">
            <RFormField
              fieldName="name"
              fieldType="text"
              label="Name of Head"
              size="lg"
            />
            <RFormField
              fieldName="accountType"
              fieldType="text"
              label="Account Type"
              accepter={SelectPicker}
              data={ledgerType}
              block={true}
              size="lg"
            />
            <RFormField
              fieldName="accountCategory"
              fieldType="text"
              label="Accounts Category"
              accepter={SelectPicker}
              data={accountCategoryData?.data?.data?.map(
                (at: { name: string; _id: string }) => ({
                  label: at?.name,
                  value: at?._id,
                })
              )}
              block={true}
              size="lg"
            />

            <RFormField
              fieldName="balanceBD"
              fieldType="number"
              label="Beginning Balance"
              size="lg"
            />
            <RFormField
              fieldName="BDDate"
              accepter={DatePicker}
              label="Account Head Entry Date"
              fieldType="text"
              block
              size="lg"
            />

            {RFormField({
              fieldName: "useAsBalance",
              accepter: Checkbox,
              label: "Use It as Balance",
              fieldType: "text",

              size: "lg",
              ...{
                value: !formValue?.useAsBalance,
                checked: formValue?.useAsBalance,
              },
            })}
            {formValue?.useAsBalance && (
              <RFormField
                fieldName="balanceType"
                accepter={SelectPicker}
                label="Balance Type"
                fieldType="text"
                block
                size="lg"
                data={balanceType}
              />
            )}

            <div className="col-span-2 w-full flex justify-end">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className=""
                  appearance="primary"
                  color="red"
                  size="lg"
                  onClick={() => router.push(`/ledger-accounts`)}
                >
                  Cancel
                </Button>
                <Button
                  className=""
                  appearance="primary"
                  color="blue"
                  size="lg"
                  onClick={() => hanldeSubmit()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </RFrom>
    </Container>
  );
};

export default LedgerForm;
