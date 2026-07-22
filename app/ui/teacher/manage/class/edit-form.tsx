"use client";

import { useActionState } from "react";
import { ClassForm, Year } from "@/app/lib/definition";
import { State } from "@/app/lib/action/class/action";
import { updateClass } from "@/app/lib/action/class/action";
import Form from "./common-form";

export default function EditClassForm({
  classData,
  callbackUrl,
  grades,
  academic_year,
}: {
  classData: ClassForm;
  callbackUrl: string;
  grades: number[];
  academic_year: Year[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateClassWithId = updateClass.bind(null, classData.id);
  const [state, formAction] = useActionState(updateClassWithId, initialState);

  return (
    <Form
      formAction={formAction}
      state={state}
      action="Edit"
      fieldValue={classData}
      callbackUrl={callbackUrl}
      grades={grades}
      academic_years={academic_year}
    />
  );
}
