import Link from "next/link";
import { PracticeActionButton } from "@/app/ui/button";
import { StatusCell } from "../table-component";
import { AssignmentRow } from "@/app/lib/definition";
import {
  deriveAssignmentStatus,
  formatDateToTime,
  formatDuration,
} from "@/app/lib/utils";

export default function AssignmentTable({
  assignments,
}: {
  assignments: AssignmentRow[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg shadow-lg/30 bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {assignments.map((a) => {
              return (
                <div key={a.id} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                    <p className="min-w-0 break-words text-lg font-medium">
                      {a.name}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="text-sm text-gray-500">
                      <p>{formatDuration(a.duration)}</p>
                      <p>Due: {formatDateToTime(a.deadline)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusCell status={a.status} score={a.score} />
                      <PracticeActionButton
                        action={
                          a.status === "In Progress" ? "continue" : "review"
                        }
                        id={a.id}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <table className="hidden min-w-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="w-1/4 px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="w-10 px-3 py-5 font-medium">
                  Duration
                </th>
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  Due
                </th>
                <th scope="col" className="w-28 px-3 py-5 font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {assignments.map((a) => {
                return (
                  <tr
                    key={a.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:last-child>td:first-child]:rounded-bl-lg"
                  >
                    <td className="py-3 pl-6 pr-3">
                      <p className="min-w-0 break-words font-medium">
                        {a.name}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <StatusCell status={a.status} score={a.score} />
                    </td>
                    <td className="break-words px-3 py-3">
                      {formatDuration(a.duration)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToTime(a.deadline)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <PracticeActionButton
                        action={
                          a.status === "In Progress" ? "continue" : "review"
                        }
                        id={a.id}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
