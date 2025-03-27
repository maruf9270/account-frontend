/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENUM_MODE } from "@/enums/EnumMode";
import React, {
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form, FormInstance } from "rsuite";
import Swal from "sweetalert2";

export function useRForm<T, handlerFunction>({
  handlerFunction,
  mode,
  message,
  defaultFormValue,
  onSuccess,
}: {
  handlerFunction?: handlerFunction;
  mode: ENUM_MODE;
  modeChanger?: React.Dispatch<SetStateAction<ENUM_MODE>>;
  model?: any;
  message?: string;
  loading?: boolean;
  defaultFormValue?: T;
  onSuccess?: () => void;
}) {
  const [formValue, setFormValue] = useState<Record<string, any>>({});
  const ref = useRef<FormInstance<Record<string, any>>>(null);

  const submitHandler = async () => {
    if (mode == ENUM_MODE.VIEW) {
      setFormValue(null as unknown as SetStateAction<Record<string, any>>);
    }
    if (ref?.current?.check()) {
      Swal.fire("Error", "Fill Out the form field", "error");
      return;
    } else {
      try {
        const result =
          handlerFunction &&
          typeof handlerFunction == "function" &&
          (await handlerFunction(formValue))?.unwrap();

        if (result?.success) {
          Swal.fire("Success", message ?? result?.message, "success");
          onSuccess?.();
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          (error ?? "Something went wrong. Try again letter") as string,
          "error"
        );
      }
    }
  };

  useEffect(() => {
    setFormValue(defaultFormValue as SetStateAction<Record<string, any>>);
  }, [defaultFormValue]);

  return {
    formValue,
    setFormValue,

    submitHandler,
    forwardedRef: ref,
  };
}
