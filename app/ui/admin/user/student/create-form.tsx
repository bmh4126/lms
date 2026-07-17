"use client";

import Form from "../common-form";
import { useActionState } from "react";
import { State } from "@/app/lib/action/common-action";
import { createStudent } from "@/app/lib/action/student/action";
import { Class } from "@/app/lib/definition";

export default function CreateStudentForm({
  classes
}: {
  classes: Class[];
}) {
  const initialSate: State = { message: "", errors: {} };
  const [state, formAction] = useActionState(createStudent, initialSate);

  return (
    <Form
      formAction={formAction}
      state={state}
      action="Create"
      classes={classes}
      passwordMessage="Default password: password123"
      role="student"
    />
  );
}
