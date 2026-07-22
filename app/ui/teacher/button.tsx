"use client";

import { deleteClass } from "@/app/lib/action/class/action";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// The current list URL (path + active filters), to return to after create/edit.
function useCallbackUrl() {
  const pathname = usePathname();
  const params = useSearchParams().toString();
  return params ? `${pathname}?${params}` : pathname;
}

export function CreateClass() {
  const callbackUrl = useCallbackUrl();
  return (
    <Link
      href={`/manage/class/create?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add new class</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateClass({ id }: { id: string }) {
  const callbackUrl = useCallbackUrl();
  return (
    <Link
      href={`/manage/class/${id}/edit?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      className="rounded-md border p-2 hover:opacity-80 bg-green-500"
    >
      <PencilIcon className="w-5 stroke-white" />
    </Link>
  );
}

export function DeleteClass({ id }: { id: string }) {
  const deleteClassWithId = deleteClass.bind(null, id);
  return (
    <form action={deleteClassWithId}>
      <button
        type="submit"
        className="rounded-md border p-2 bg-red-500 hover:opacity-80"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 stroke-white" />
      </button>
    </form>
  );
}
