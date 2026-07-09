"use client";

import Form from "../common-form";
import { useActionState } from "react";
import { State } from "@/app/lib/action/common-action";
import { createStudent } from "@/app/lib/action/student/action";

export default function CreateTeacherForm({
  grades,
}: {
  grades: { position: number }[];
}) {
  const initialSate: State = { message: "", errors: {} };
  const [state, formAction] = useActionState(createStudent, initialSate);

  return (
    <Form
      formAction={formAction}
      state={state}
      action="Create"
      grades={grades}
      passwordMessage="Default password: password123"
      role="student"
    />
  );
}
