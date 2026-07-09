"use client";

import { UserForm } from "@/app/lib/definition";
import { State } from "@/app/lib/action/common-action";
import { updateStudent } from "@/app/lib/action/student/action";
import { useActionState } from "react";
import Form from "../common-form";

export default function EditTeacherForm({
  student,
  grades,
}: {
  student: UserForm;
  grades: { position: number }[];
}) {
  const initialSate: State = { message: null, errors: {} };
  const updateStudentWithId = updateStudent.bind(null, student.id); //
  const [state, formAction] = useActionState(updateStudentWithId, initialSate);
  return (
    <Form
      formAction={formAction}
      action="Edit"
      state={state}
      fieldValue={student}
      grades={grades}
      passwordMessage="Leave blank to keep password unchanged"
      role="student"
    />
  );
}
