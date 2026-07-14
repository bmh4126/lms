import { fetchFilteredTeacher } from "@/app/lib/data/teacher/data";
import { TeacherForm } from "@/app/lib/definition";
import { UpdateObj, DeleteObj } from "../../buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { FillerRows } from "@/app/ui/table-filler";

export default async function AdminTeacherTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const teachers = await fetchFilteredTeacher(query, currentPage);
  const fillerCount = 6 - (teachers?.length ?? 0);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {teachers?.map((teacher, index) => (
              <div
                key={teacher.id}
                // className={`mb-2 w-full rounded-md bg-white p-4 border-r-2 border-b-2 ${
                //   index > 0 && user.label !== users[index - 1].label
                //     ? "mt-10"
                //     : ""
                // }`}
              >
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4 text-xl font-medium">
                  <p className="min-w-0 break-words">{teacher.name}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{teacher.email}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(teacher.created_at)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateObj id={teacher.id} type="teacher" />
                    <DeleteObj id={teacher.id} type="teacher" />
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
                <th scope="col" className="w-40 px-3 py-5 font-medium">
                  Date created
                </th>
                <th scope="col" className="w-24 relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {teachers?.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  // className={`w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg ${
                  //   index > 0 && teacher.label !== teacher[index - 1].label
                  //     ? "border-t-4 border-t-black"
                  //     : ""
                  // }`}
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Image Placeholder */}
                      <p className="min-w-0 break-words">{teacher.name}</p>
                    </div>
                  </td>
                  <td className="break-words px-3 py-3">{teacher.email}</td>
                  <td className="break-words px-3 py-3">
                    {formatDateToLocal(teacher.created_at)}
                  </td>
                  <td className="break-words py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateObj id={teacher.id} type="teacher" />
                      <DeleteObj id={teacher.id} type="teacher" />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Grey filler rows keep the table height constant on short pages. */}
              <FillerRows count={fillerCount} colSpan={4} heightClass="h-9" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
