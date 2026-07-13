import Link from "next/link";
import clsx from "clsx";
import { ExamRow } from "@/app/lib/definition";
import { PracticeActionButton } from "@/app/ui/button";
import { StatusCell } from "../table-component";
import { formatDateToTime, formatDuration, openTime } from "@/app/lib/utils";

export default function ExamTable({ exams }: { exams: ExamRow[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="shadow-md/30 rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {exams.map((e) => (
              <div key={e.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <p className="min-w-0 break-words text-lg font-medium">
                    {e.name}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    <p>{formatDuration(e.duration)}</p>
                    <p>{e.questions} questions</p>
                    <p>Opens: {formatDateToTime(openTime(e.deadline, e.duration))}</p>
                    <p>Closes: {formatDateToTime(e.deadline)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusCell status={e.status} score={e.score} />
                    <PracticeActionButton
                      action={
                        e.status === "In Progress"
                          ? "continue"
                          : e.status === "Before Open"
                            ? "locked"
                            : "review"
                      }
                      disabled={e.status === "Before Open"}
                      id={e.id}
                    />
                  </div>
                </div>
              </div>
            ))}
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
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  Duration
                </th>
                <th scope="col" className="w-1/10 px-3 py-5 font-medium">
                  Questions
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Open Time
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Close Time
                </th>
                <th scope="col" className="w-28 px-3 py-5 font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {exams.map((e) => (
                <tr
                  key={e.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:last-child>td:first-child]:rounded-bl-lg"
                >
                  <td className="py-3 pl-6 pr-3">
                    <p className="min-w-0 break-words font-medium">{e.name}</p>
                  </td>
                  <td className="px-3 py-3">
                    <StatusCell status={e.status} score={e.score} />
                  </td>
                  <td className="break-words px-3 py-3">
                    {formatDuration(e.duration)}
                  </td>
                  <td className="break-words px-3 py-3">{e.questions}</td>
                  <td className="px-3 py-3">
                    {formatDateToTime(openTime(e.deadline, e.duration))}
                  </td>
                  <td className="px-3 py-3">
                    {formatDateToTime(e.deadline)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <PracticeActionButton
                      action={
                        e.status === "In Progress"
                          ? "continue"
                          : e.status === "Before Open"
                            ? "locked"
                            : "review"
                      }
                      id={e.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
