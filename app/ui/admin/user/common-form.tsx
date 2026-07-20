"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../button";
import { Class, TeacherForm, StudentForm } from "@/app/lib/definition";
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { State } from "@/app/lib/action/common-action";
import ErrorMessageBox from "@/app/ui/error-message";

export default function Form({
  formAction,
  fieldValue,
  state,
  action,
  classes,
  passwordMessage,
  role,
  callbackUrl,
}: {
  formAction: (payload: FormData) => void;
  fieldValue?: TeacherForm | StudentForm;
  state: State;
  action: string;
  classes?: Class[];
  passwordMessage: string;
  role: string;
  callbackUrl: string;
}) {
  const fields = fieldValue ? fieldValue : { name: "", email: "", grade: "" };
  const defaultPassword = action === "Edit" ? "" : "password123";

  // Grade/Class only apply to students. Derive the initial grade from the
  // student's current class (edit mode) so the class list is pre-filtered.
  const studentFields = fields as StudentForm;
  const initialGrade = classes?.find(
    (c) => c.label === studentFields.class,
  )?.grade_level;

  const [grade, setGrade] = useState<string>(
    initialGrade != null ? String(initialGrade) : "",
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    studentFields.class ?? "",
  );

  // Distinct grade levels for the Grade dropdown (a grade can have many classes).
  const gradeOptions = classes
    ? Array.from(new Set(classes.map((c) => c.grade_level))).sort((a, b) => a - b)
    : [];

  // Only the classes whose grade matches the chosen grade.
  const classOptions = classes
    ? classes.filter((c) => String(c.grade_level) === grade)
    : [];
  return (
    <form action={formAction}>
      {/* Where to return after a successful submit (read by the action). */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Teacher Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 flex text-sm font-medium">
            Enter the name
            <p className="text-sm text-red-500 ml-1">*</p>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={fields.name}
                placeholder={`Enter ${role} name`}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.errors.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* Teacher Email */}
        <div className="mb-4">
          <label htmlFor="email" className="flex mb-2 text-sm font-medium">
            Enter the email
            <p className="text-sm text-red-500 ml-1">*</p>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={fields.email}
                placeholder={`Enter ${role} email`}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.errors.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* Teacher Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 text-sm font-medium grid grid-cols-[auto_1fr_auto] items-center"
          >
            Enter new the password
            <p className="text-xs text-red-500 ml-1">({passwordMessage})</p>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                defaultValue={defaultPassword}
                placeholder="Enter new password"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password &&
                state.errors.password.errors.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Grade + Class — students only */}
        {role === "student" && (
          <>
            {/* Choose Grade */}
            <div className="mb-4">
              <label htmlFor="grade" className="mb-2 flex text-sm font-medium">
                Choose Grade
                <p className="text-sm text-red-500 ml-1">*</p>
              </label>
              <div className="relative">
                <select
                  id="grade"
                  name="grade"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value);
                    // The current class may not belong to the new grade — reset it.
                    setSelectedClass("");
                  }}
                >
                  <option value="" disabled>
                    Select a grade
                  </option>
                  {gradeOptions.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
                <BuildingLibraryIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="grade-error" aria-live="polite" aria-atomic="true">
                {state.errors?.grade &&
                  state.errors.grade.errors.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Choose Class */}
            <div className="mb-4">
              <label htmlFor="class" className="mb-2 flex text-sm font-medium">
                Choose Class
                <p className="text-sm text-red-500 ml-1">*</p>
              </label>
              <div className="relative">
                <select
                  id="class"
                  name="class_id"
                  disabled={!grade}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                  defaultValue={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="" disabled>
                    {grade ? "Select a class" : "Select a grade first"}
                  </option>
                  {classOptions.map((c) => (
                    <option key={c.label} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="class-error" aria-live="polite" aria-atomic="true">
                {state.errors?.class &&
                  state.errors.class.errors.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </>
        )}
        {state.message ? <ErrorMessageBox message={state.message} /> : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={callbackUrl}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          {action} {role}
        </Button>
      </div>
    </form>
  );
}
