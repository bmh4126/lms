import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteTeacher } from "@/app/lib/action/teacher/action";
import { deleteStudent } from "@/app/lib/action/student/action";

export function CreateUser({ role }: { role: string }) {
  return (
    <Link
      href={`/admin/${role}s/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add new {role}</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateUser({ role, id }: { role: string; id: string }) {
  return (
    <Link
      href={`/admin/${role}s/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUser({ role, id }: { role: string; id: string }) {
  const deleteUserWithId =
    role === "teacher"
      ? deleteTeacher.bind(null, id)
      : deleteStudent.bind(null, id);
  return (
    <form action={deleteUserWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
