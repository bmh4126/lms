"use client";

import { useActionState, useState } from "react";
import { Button } from "../../button";
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  ClockIcon,
  DocumentIcon,
  GlobeAltIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Cancel } from "../../back";
import clsx from "clsx";
import QuestionsBuilder, { QuestionDraft } from "./questions-builder";
import { AssessmentEdit, Class } from "@/app/lib/definition";
import { updateAssessment } from "@/app/lib/action/assessment/action";
import { State } from "@/app/lib/action/common-action";
import { dateToLocalTime } from "@/app/lib/utils";

// Only GMT+7 for now. The value is an ISO offset so the server can append it to
// the datetime-local string to build a correct UTC instant. (More zones later.)
const TIMEZONE_OFFSET = "+07:00";
const TIMEZONE_LABEL = "GMT+7";

export default function EditAssessmentForm({
  assessment,
  classes,
  grades,
  callbackUrl,
}: {
  assessment: AssessmentEdit;
  classes: Class[];
  grades: number[];
  callbackUrl: string;
}) {
  // Close must be after open, and can only be set once open is set — so we
  // track both here to disable/bound the close picker on the client.
  const [name, setName] = useState(assessment.name);
  const [open, setOpen] = useState(dateToLocalTime(assessment.open));
  const [close, setClose] = useState(dateToLocalTime(assessment.close));
  const [message, setMessage] = useState("");
  const [questionsOk, setQuestionsOk] = useState(true);

  // Who the assessment targets, prefilled from the existing assessment.
  const [scope, setScope] = useState<"class" | "grade">(assessment.scope);
  const [grade, setGrade] = useState(String(assessment.grade_level));
  const [classId, setClassId] = useState(assessment.class_id ?? "");

  // Existing questions → QuestionsBuilder draft shape (derive correctOptionId
  // from whichever option is marked correct).
  const initialQuestions: QuestionDraft[] = assessment.questions.map((q) => ({
    id: q.id,
    label: q.label,
    options: q.options.map((o) => ({ id: o.id, label: o.label })),
    correctOptionId: q.options.find((o) => o.is_correct)?.id ?? null,
  }));

  // Only classes belonging to the chosen grade — keeps the class picker short.
  const classOptions = grade
    ? classes.filter((c) => String(c.grade_level) === grade)
    : [];

  // Grade scope needs a grade; class scope needs a grade AND a class.
  const scopeOk =
    scope === "grade" ? grade !== "" : grade !== "" && classId !== "";

  // Enable Create only when every required field is filled, there's no
  // validation error, and every question is complete. (type defaults to
  // Assignment; timezone is fixed GMT+7.)
  const isValid =
    name.trim() !== "" &&
    open !== "" &&
    close !== "" &&
    scopeOk &&
    message !== "invalid" &&
    questionsOk;

  const initialSate: State = { message: "", errors: {} };
  const updateWithId = updateAssessment.bind(null, assessment.id);
  const [state, formAction] = useActionState(updateWithId, initialSate);

  return (
    <form action={formAction}>
      {/* Where to return after a successful update (read by the action). */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Assessment type */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Pick a type
            <span className="ml-1 text-red-500">*</span>
          </legend>
          <div className="py-1">
            <div className="flex gap-4">
              <label
                htmlFor="assignment"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-400"
              >
                <input
                  id="assignment"
                  name="type"
                  type="radio"
                  value="assignment"
                  className="sr-only"
                  defaultChecked={assessment.type === "assignment"}
                />
                <PencilSquareIcon className="h-5 w-5" />
                Assignment
              </label>
              <label
                htmlFor="exam"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-400"
              >
                <input
                  id="exam"
                  name="type"
                  type="radio"
                  value="exam"
                  className="sr-only"
                  defaultChecked={assessment.type === "exam"}
                />
                <DocumentIcon className="h-5 w-5" />
                Exam
              </label>
            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {/* {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))} */}
            </div>
          </div>
        </fieldset>

        {/* Scope: target a whole grade or a single class */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Pick a scope
            <span className="ml-1 text-red-500">*</span>
          </legend>
          <div className="flex gap-4">
            <label
              htmlFor="scope-class"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-400"
            >
              <input
                id="scope-class"
                name="scope"
                type="radio"
                value="class"
                className="sr-only"
                checked={scope === "class"}
                onChange={() => {
                  setScope("class");
                  setClassId("");
                }}
              />
              <AcademicCapIcon className="h-5 w-5" />
              Class
            </label>
            <label
              htmlFor="scope-grade"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-400"
            >
              <input
                id="scope-grade"
                name="scope"
                type="radio"
                value="grade"
                className="sr-only"
                checked={scope === "grade"}
                onChange={() => {
                  setScope("grade");
                  setClassId("");
                }}
              />
              <BuildingLibraryIcon className="h-5 w-5" />
              Grade
            </label>
          </div>
        </fieldset>

        {/* Grade — always shown */}
        <div className="mb-4">
          <label htmlFor="grade" className="mb-2 flex text-sm font-medium">
            Pick a grade
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="grade"
              name="grade"
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                // The chosen class may not belong to the new grade — reset it.
                setClassId("");
              }}
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
            <BuildingLibraryIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Class — always shown, but disabled for grade scope or until a grade
            is picked; options are filtered to that grade (keeps the list short) */}
        <div className="mb-4">
          <label htmlFor="class_id" className="mb-2 flex text-sm font-medium">
            Pick a class
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="class_id"
              name="class_id"
              disabled={scope === "grade" || !grade}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="" disabled>
                {scope === "grade"
                  ? "Not needed for grade scope"
                  : grade
                    ? "Select a class"
                    : "Pick a grade first"}
              </option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-disabled:text-gray-300" />
          </div>
        </div>
        {/* Assessment Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 flex text-sm font-medium">
            Enter the name
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter assessment name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Open / Close time */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="open" className="mb-2 flex text-sm font-medium">
              Open time
              <span className="ml-1 text-sm text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="open"
                name="open"
                type="datetime-local"
                required
                value={open}
                onChange={(e) => {
                  setOpen(e.target.value);
                  // A close earlier than the new open is no longer valid.
                  if (close && e.target.value && close < e.target.value) {
                    setClose("");
                  }
                }}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label htmlFor="close" className="mb-2 flex text-sm font-medium">
              Close time
              <span className="ml-1 text-sm text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="close"
                name="close"
                type="datetime-local"
                required
                // Can only pick a close time after an open time is set, and the
                // browser won't allow a value before `min` (= open).
                disabled={!open}
                min={open}
                value={close}
                onChange={(e) => {
                  setClose(e.target.value);
                  setMessage("");
                  if (open > e.target.value) {
                    setMessage("invalid");
                  }
                }}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {(!open || message === "invalid") && (
              <p
                className={clsx("mt-2 text-xs text-gray-500", {
                  "text-red-500": message === "invalid",
                })}
              >
                {message === ""
                  ? "Please set the open time first."
                  : "Please set a valid close time"}
              </p>
            )}
          </div>
        </div>

        {/* Timezone — the open/close times are interpreted in this zone */}
        <div className="mb-4">
          <label htmlFor="timezone" className="mb-2 flex text-sm font-medium">
            Timezone
          </label>
          <div className="relative">
            <select
              id="timezone"
              name="timezone"
              defaultValue={TIMEZONE_OFFSET}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            >
              <option value={TIMEZONE_OFFSET}>{TIMEZONE_LABEL}</option>
            </select>
            <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Open and close times are interpreted in this timezone.
          </p>
        </div>

        {/* Questions */}
        <QuestionsBuilder
          onValidityChange={setQuestionsOk}
          initialQuestions={initialQuestions}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Cancel href={callbackUrl} />
        <Button type="submit" disabled={!isValid} aria-disabled={!isValid}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

