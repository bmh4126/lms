"use client";

import { TeacherForm } from "@/app/lib/definition";
import { State } from "@/app/lib/action/common-action";
import { updateTeacher } from "@/app/lib/action/teacher/action";
import { useActionState } from "react";
import Form from "../common-form";

export default function EditTeacherForm({
  teacher,
  callbackUrl,
}: {
  teacher: TeacherForm;
  callbackUrl: string;
}) {
  const initialSate: State = { message: null, errors: {} };
  const updateTeacherWithId = updateTeacher.bind(null, teacher.id);
  const [state, formAction] = useActionState(updateTeacherWithId, initialSate);
  return (
    <Form
      formAction={formAction}
      action="Edit"
      state={state}
      fieldValue={teacher}
      passwordMessage="Leave blank to keep password unchanged"
      role="teacher"
      callbackUrl={callbackUrl}
    />
  );
}
