"use client";

import Link from "next/link";
import { Button } from "../../button";
import { UserForm } from "@/app/lib/definition";
import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { State } from "@/app/lib/action/common-action";
import ErrorMessageBox from "@/app/ui/error-message";

export default function Form({
  formAction,
  fieldValue,
  state,
  action,
  grades,
  passwordMessage,
  role,
}: {
  formAction: (payload: FormData) => void;
  fieldValue?: UserForm;
  state: State;
  action: string;
  grades: { position: number }[];
    passwordMessage: string;
    role: string;
}) {
  const fields = fieldValue ? fieldValue : { name: "", email: "", grade: "" };
  const defaultPassword = action === "Edit" ? "" : "password123";
  return (
    <form action={formAction}>
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
                placeholder="Enter teacher name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                placeholder="Enter teacher email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
        {/* Teacher Grade */}
        <div className="mb-4">
          <label htmlFor="grade" className="mb-2 flex text-sm font-medium">
            Choose grade
            <p className="text-sm text-red-500 ml-1">*</p>
          </label>
          <div className="relative">
            <select
              id="grade"
              name="grade"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={fields.grade}
            >
              <option value="" disabled>
                Select a grade
              </option>
              {grades.map((grade) => (
                <option key={grade.position} value={grade.position}>
                  Grade {grade.position}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.grade &&
              state.errors.grade.errors.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {state.message ? <ErrorMessageBox message={state.message} /> : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/admin/${role}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">{action} Teacher</Button>
      </div>
    </form>
  );
}
