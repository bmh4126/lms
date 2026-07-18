"use client";

import { CreateTeacher } from "@/app/lib/action/teacher/action";
import { State } from "@/app/lib/action/common-action";
import Form from "../common-form";
import { useActionState } from "react";

export default function CreateTeacherForm() {
  const initialSate: State = { message: "", errors: {} };
  const [state, formAction] = useActionState(CreateTeacher, initialSate);

  return (
    <Form
      formAction={formAction}
      state={state}
      action="Create"
      passwordMessage="Default password: password123"
      role="teacher"
    />
  );
}
