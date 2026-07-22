"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../button";
import { ClassForm, ClassStudent, Year } from "@/app/lib/definition";
import { State } from "@/app/lib/action/class/action";
import ErrorMessageBox from "@/app/ui/error-message";
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import StudentPicker from "./student-picker";

export default function Form({
  formAction,
  fieldValue,
  state,
  action,
  callbackUrl,
  grades,
  academic_years,
}: {
  formAction: (payload: FormData) => void;
  fieldValue?: ClassForm;
  state: State;
  action: string;
  callbackUrl: string;
  grades: number[];
  academic_years: Year[];
}) {
  const [name, setName] = useState(fieldValue?.label ?? "");
  const [grade, setGrade] = useState(
    fieldValue ? String(fieldValue.grade_level) : "",
  );
  const [students, setStudents] = useState<ClassStudent[]>(
    fieldValue?.students ?? [],
  );
  const [academic_year, setAcademicYear] = useState(
    fieldValue?.academic_year_id ?? "",
  );

  // A class needs a name, a grade, and at least one student.
  const isValid = name.trim() !== "" && grade !== "" && students.length >= 1;

  return (
    <form action={formAction}>
      {/* Where to return after a successful submit (read by the action). */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Class name (stored as `label`) */}
        <div className="mb-4">
          <label htmlFor="label" className="mb-2 flex text-sm font-medium">
            Class name
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="label"
              name="label"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter class name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <BuildingLibraryIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.label?.errors.map((err: string) => (
            <p key={err} className="mt-2 text-sm text-red-500">
              {err}
            </p>
          ))}
        </div>

        {/* Grade */}
        <div className="mb-4">
          <label
            htmlFor="grade_level"
            className="mb-2 flex text-sm font-medium"
          >
            Grade
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="grade_level"
              name="grade_level"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            >
              <option value="" disabled>
                Select a grade
              </option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.grade_level?.errors.map((err: string) => (
            <p key={err} className="mt-2 text-sm text-red-500">
              {err}
            </p>
          ))}
        </div>

        {/* Academic Year */}
        <div className="mb-4">
          <label
            htmlFor="academic_year"
            className="mb-2 flex text-sm font-medium"
          >
            Academic Semester
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="academic_year"
              name="academic_year"
              value={academic_year}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            >
              <option value="" disabled>
                Select a semester
              </option>
              {academic_years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.label}
                </option>
              ))}
            </select>
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.grade_level?.errors.map((err: string) => (
            <p key={err} className="mt-2 text-sm text-red-500">
              {err}
            </p>
          ))}
        </div>

        {/* Students — the picker renders its own label + upload button */}
        <div className="mt-4 mb-4">
          <StudentPicker students={students} setStudents={setStudents} />
        </div>

        {state.message ? <ErrorMessageBox message={state.message} /> : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={callbackUrl}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={!isValid} aria-disabled={!isValid}>
          {action} class
        </Button>
      </div>
    </form>
  );
}
