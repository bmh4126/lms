"use client";

import { TeacherForm } from "@/app/lib/definition";
import { State } from "@/app/lib/action/teacher/action";
import { updateTeacher } from "@/app/lib/action/teacher/action";
import { useActionState } from "react";
import Form from "./common-form";

export default function EditTeacherForm({
  teacher,
  grades,
}: {
  teacher: TeacherForm;
  grades: { position: number }[];
}) {
  const initialSate: State = { message: null, errors: {} };
  const updateTeacherWithId = updateTeacher.bind(null, teacher.id);
  const [state, formAction] = useActionState(updateTeacherWithId, initialSate);
  return <Form formAction={formAction} action="Edit" state={state} fieldValue={teacher}/>;
}
