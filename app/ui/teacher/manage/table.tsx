import { ClassRow } from "@/app/lib/definition";
import { UpdateClass, DeleteClass } from "../button";
import { FillerRows } from "../../table-filler";

export default function TeacherClassTable({
  classes,
}: {
  classes: ClassRow[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {classes?.map((c, i) => (
              <div
                key={c.id}
                className={`mb-2 w-full rounded-md bg-white p-4 border-r-2 border-b-2 ${
                  i > 0 && c.grade_level !== classes[i - 1].grade_level
                    ? "mt-10"
                    : ""
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4 text-xl font-medium">
                  <p className="min-w-0 break-words">{c.label}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{c.grade_level}</p>
                    <p className="text-sm text-gray-500">{c.total_student}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateClass id={c.id} />
                    <DeleteClass id={c.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full w-full h-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="w-1/2 px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Grade
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Total students
                </th>
                <th scope="col" className="w-35 relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {classes?.map((c, i) => (
                <tr
                  key={c.id}
                  className={`w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg
                  `}
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Image Placeholder */}
                      <p className="min-w-0 break-words">{c.label}</p>
                    </div>
                  </td>
                  <td className="break-words px-3 py-3">{c.grade_level}</td>
                  <td className="break-words px-3 py-3">{c.total_student}</td>
                  <td className="break-words py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateClass id={c.id} />
                      <DeleteClass id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Grey filler rows keep the table height constant on short pages. */}
              <FillerRows
                count={6 - (classes.length % 6)}
                colSpan={4}
                heightClass="h-9"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
