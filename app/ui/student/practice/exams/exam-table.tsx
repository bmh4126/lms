"use client";

import { useSearchParams } from "next/navigation";
import { ExamRow } from "@/app/lib/definition";
import { PracticeActionButton } from "@/app/ui/button";
import { StatusCell } from "../table-component";
import Pagination from "@/app/ui/paginations";
import { LocalDateTime } from "@/app/ui/local-datetime";
import { FillerRows } from "@/app/ui/table-filler";
import { closeTime, compareExams, formatDuration } from "@/app/lib/utils";

const PAGE_SIZE = 6;

export default function ExamTable({ exams }: { exams: ExamRow[] }) {
  const searchParams = useSearchParams();
  const sorted = [...exams].sort(compareExams);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(1, Number(searchParams.get("page")) || 1),
    totalPages,
  );
  const pageRows = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="shadow-md/30 rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {pageRows.map((e) => (
              <div key={e.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <p className="min-w-0 break-words text-lg font-medium">
                    {e.name}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    <p>{formatDuration(e.duration)}</p>
                    <p>{e.question_count} questions</p>
                    <p>
                      Opens: <LocalDateTime date={e.start} />
                    </p>
                    <p>
                      Closes:{" "}
                      <LocalDateTime date={closeTime(e.start, e.duration)} />
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusCell status={e.status} score={e.score} />
                    <PracticeActionButton
                      status={e.status}
                      id={e.id}
                      type="exam"
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
              {pageRows.map((e) => (
                <tr
                  key={e.id}
                  className="w-full shadow-md/30 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:last-child>td:first-child]:rounded-bl-lg"
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
                  <td className="break-words px-3 py-3">{e.question_count}</td>
                  <td className="px-3 py-3">
                    <LocalDateTime date={e.start} />
                  </td>
                  <td className="px-3 py-3">
                    <LocalDateTime date={closeTime(e.start, e.duration)} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <PracticeActionButton
                      status={e.status}
                      id={e.id}
                      type="exam"
                    />
                  </td>
                </tr>
              ))}
              <FillerRows count={PAGE_SIZE - pageRows.length} colSpan={7} />
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
