"use client";

import {
  CreateTeacher,
  State,
  updateTeacher,
} from "@/app/lib/action/teacher/action";
import Form from "./common-form";
import { useActionState } from "react";

export default function CreateTeacherForm({
  grades,
}: {
  grades: { position: number }[];
}) {
  const initialSate: State = { message: "", errors: {} };
  const [state, formAction] = useActionState(CreateTeacher, initialSate);

  return (
    <Form
      formAction={formAction}
      state={state}
      action="Create"
      grades={grades}
      passwordMessage="Default password: password123"
    />
  );
}
