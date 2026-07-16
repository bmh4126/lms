"use client";

import { useSearchParams } from "next/navigation";
import { PracticeActionButton } from "@/app/ui/button";
import { StatusCell } from "../table-component";
import { Assessment } from "@/app/lib/definition";
import Pagination from "@/app/ui/paginations";
import { LocalDateTime } from "@/app/ui/local-datetime";
import { FillerRows } from "@/app/ui/table-filler";

const PAGE_SIZE = 6;

export default function AssignmentTable({
  assignments,
}: {
  assignments: Assessment[];
}) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(assignments.length / PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(1, Number(searchParams.get("page")) || 1),
    totalPages,
  );
  const pageRows = assignments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg shadow-lg/30 bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {pageRows.map((a) => (
              <div key={a.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <p className="min-w-0 break-words text-lg font-medium">
                    {a.name}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    <p>
                      Due: <LocalDateTime date={a.close} />
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusCell assessment={a} />
                    <PracticeActionButton assessment={a} />
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
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Open
                </th>
                <th scope="col" className="w-1/6 px-3 py-5 font-medium">
                  Close
                </th>
                <th scope="col" className="w-28 px-3 py-5 font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageRows.map((a) => (
                <tr
                  key={a.id}
                  className="w-full shadow-md/30 py-3 text-sm [&:first-child>td:first-child]:rounded-tl-lg [&:last-child>td:first-child]:rounded-bl-lg"
                >
                  <td className="py-4 pl-6 pr-3">
                    <p className="min-w-0 break-words font-medium">{a.name}</p>
                  </td>
                  <td className="px-3 py-4">
                    <StatusCell assessment={a} />
                  </td>
                  <td className="break-words px-3 py-4">
                    <LocalDateTime date={a.open} />
                  </td>
                  <td className="break-words px-3 py-4">
                    <LocalDateTime date={a.close} />
                  </td>
                  <td className="px-3 py-4 text-center">
                    <PracticeActionButton assessment={a} />
                  </td>
                </tr>
              ))}
              <FillerRows count={PAGE_SIZE - pageRows.length} colSpan={5} />
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
