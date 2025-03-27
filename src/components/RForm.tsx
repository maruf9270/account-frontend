import { ENUM_MODE } from "@/enums/EnumMode";
import React, { ReactNode, Ref, SetStateAction } from "react";
import { Form, FormInstance } from "rsuite";

export function RFrom<T>({
  children,
  mode,
  model,
  loading,
  formValue,
  setFormValue,
  forwardedRef,
  ...rest
}: {
  children: ReactNode;

  mode: ENUM_MODE;

  model?: any;

  loading?: boolean;
  formValue: T;
  setFormValue: React.Dispatch<SetStateAction<T | Record<string, any>>>;
  forwardedRef: Ref<FormInstance<Record<string, any>>>;
  fluid: boolean;
}) {
  return (
    <Form
      onChange={setFormValue}
      formValue={formValue as Record<string, any>}
      disabled={mode == ENUM_MODE.VIEW || loading}
      ref={forwardedRef}
      model={model ? model : ""}
      {...rest}
    >
      {children}
    </Form>
  );
}
