"use client";

import { useActionState } from "react";
import { State } from "@/app/lib/action/class/action";
import { createClass } from "@/app/lib/action/class/action";
import Form from "./common-form";
import { Year } from "@/app/lib/definition";

export default function CreateClassForm({
  callbackUrl,
  grades,
  academic_years,
}: {
  callbackUrl: string;
  grades: number[];
  academic_years: Year[];
}) {
  const initialState: State = { message: "", errors: {} };
  const [state, formAction] = useActionState(createClass, initialState);

  return (
    <Form
      formAction={formAction}
      state={state}
      action="Create"
      callbackUrl={callbackUrl}
      grades={grades}
      academic_years={academic_years}
    />
  );
}
