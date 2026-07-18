import { AssessmentRow } from "@/app/lib/definition";
import { UpdateObj, DeleteObj } from "../buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { FillerRows } from "@/app/ui/table-filler";

export default function AdminAssessmentTable({
  assessments,
}: {
  assessments: AssessmentRow[];
}) {
  const fillerCount = 6 - assessments.length;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {assessments.map((a) => (
              <div key={a.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <p className="min-w-0 break-words text-lg font-medium">
                    {a.name}
                  </p>
                  <span className="shrink-0 text-sm capitalize text-gray-500">
                    {a.type}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    <p>{a.question_count} questions</p>
                    <p>Open: {formatDateToLocal(a.open)}</p>
                    <p>Close: {formatDateToLocal(a.close)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateObj id={a.id} type="assessment" />
                    <DeleteObj id={a.id} type="assessment" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <table className="hidden min-w-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="w-1/3 px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="w-24 px-3 py-5 font-medium">
                  Questions
                </th>
                <th scope="col" className="w-40 px-3 py-5 font-medium">
                  Open
                </th>
                <th scope="col" className="w-40 px-3 py-5 font-medium">
                  Close
                </th>
                <th scope="col" className="w-24 px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="w-24 relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {assessments.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 pl-6 pr-3">
                    <p className="min-w-0 break-words font-medium">{a.name}</p>
                  </td>
                  <td className="px-3 py-3">{a.question_count}</td>
                  <td className="break-words px-3 py-3">
                    {formatDateToLocal(a.open)}
                  </td>
                  <td className="break-words px-3 py-3">
                    {formatDateToLocal(a.close)}
                  </td>
                  <td className="px-3 py-3 capitalize">{a.type}</td>
                  <td className="break-words py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateObj id={a.id} type="assessment" />
                      <DeleteObj id={a.id} type="assessment" />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Grey filler rows keep the table height constant on short pages. */}
              <FillerRows count={fillerCount} colSpan={6} heightClass="h-9" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
