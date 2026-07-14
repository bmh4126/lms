// import Image from "next/image";
import { UpdateObj, DeleteObj } from "../../buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { StudentTable } from "@/app/lib/definition";
import { fetchFilteredStudent } from "@/app/lib/data/student/data";
import { FillerRows } from "@/app/ui/table-filler";


export default async function AdminStudentTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const students = await fetchFilteredStudent(query, currentPage);
  const fillerCount = 6 - (students?.length ?? 0);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {students?.map((student, index) => (
              <div
                key={student.id}
                className={`mb-2 w-full rounded-md bg-white p-4 border-r-2 border-b-2 ${
                  index > 0 && student.label !== students[index - 1].label
                    ? "mt-10"
                    : ""
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4 text-xl font-medium">
                  <p className="min-w-0 break-words">{student.name}</p>
                  <p className="whitespace-nowrap">{student.label}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{student.email}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(student.created_at)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateObj id={student.id} type='student' />
                    <DeleteObj id={student.id} type='student' />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full w-full h-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="w-1/4 px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="w-1/3 px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="w-20 px-3 py-5 font-medium">
                  Class
                </th>
                <th scope="col" className="w-40 px-3 py-5 font-medium">
                  Date created
                </th>
                <th scope="col" className="w-24 relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {students?.map((student, index) => (
                <tr
                  key={student.id}
                  className={`w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg ${
                    index > 0 && student.label !== students[index - 1].label
                      ? "border-t-4 border-t-black"
                      : ""
                  }`}
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Image Placeholder */}
                      <p className="min-w-0 break-words">{student.name}</p>
                    </div>
                  </td>
                  <td className="break-words px-3 py-3">{student.email}</td>
                  <td className="break-words px-3 py-3">{student.label}</td>
                  <td className="break-words px-3 py-3">
                    {formatDateToLocal(student.created_at)}
                  </td>
                  <td className="break-words py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateObj id={student.id} type='student' />
                      <DeleteObj id={student.id} type='student' />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Grey filler rows keep the table height constant on short pages. */}
              <FillerRows count={fillerCount} colSpan={5} heightClass="h-9" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
