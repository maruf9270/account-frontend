/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, InputProps } from "rsuite";
import { InputItemDataType } from "rsuite/esm/InputPicker";

const RFormField = ({
  label,
  fieldName,
  fieldType,
  labelClass,
  fieldClass,
  size,
  accepter,
  data,
  ...rest
}: {
  label: string;
  fieldName: string;
  fieldType?:
    | "text"
    | "email"
    | "password"
    | "checkbox"
    | "radio"
    | "select"
    | "textarea"
    | "number";
  labelClass?: string;
  fieldClass?: string;
  size?: InputProps["size"];
  accepter?: any;
  data?: InputItemDataType;
  block?: true;
}) => {
  return (
    <Form.Group>
      <Form.ControlLabel className={labelClass}>{label}</Form.ControlLabel>
      <Form.Control
        name={fieldName}
        type={fieldType}
        className={fieldClass}
        size={size}
        accepter={accepter}
        data={data}
        {...rest}
      />
    </Form.Group>
  );
};

export default RFormField;
