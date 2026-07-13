import Link from "next/link";
import clsx from "clsx";
import { Exam } from "@/app/lib/definition";
import { PracticeActionButton } from "@/app/ui/button";
import { StatusCell } from "../table-component";

// DRAFT UI — assignments/exams to do. Mock data; real fetching wired later.
// Columns: Name | Kind | Duration | Questions | Status (+ score when done).

const assignments: Exam[] = [
  {
    id: "1",
    name: "Addition within 10",
    duration: "20 min",
    questions: 10,
    status: "Done",
    deadline: "2026-07-07 10:18",
    score: "9/10",
  },
  {
    id: "2",
    name: "Comparing numbers",
    duration: "15 min",
    questions: 8,
    status: "Dued",
    deadline: "2026-07-07 10:18",
  },
  {
    id: "3",
    name: "Chapter 1 Exam",
    duration: "45 min",
    questions: 20,
    status: "Done",
    score: "17/20",
    deadline: "2026-07-07 10:18",
  },
  {
    id: "4",
    name: "Counting practice",
    duration: "10 min",
    questions: 6,
    status: "Before Open",
    deadline: "2026-07-07 10:18",
  },
  {
    id: "5",
    name: "Shapes quiz",
    duration: "30 min",
    questions: 12,
    status: "In Progress",
    deadline: "2026-07-07 10:18",
  },
];

export default function ExamTable() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="shadow-md/30 rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {assignments.map((a) => (
              <div key={a.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <p className="min-w-0 break-words text-lg font-medium">
                    {a.name}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    <p>{a.duration}</p>
                    <p>{a.questions} questions</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusCell status={a.status} score={a.score} />
                    <PracticeActionButton
                      action={
                        a.status === "In Progress"
                          ? "continue"
                          : a.status === "Before Open"
                            ? "locked"
                            : "review"
                      }
                      disabled={a.status === "Before Open"}
                      id={a.id}
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
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  Questions
                </th>
                <th scope="col" className="w-1/4 px-3 py-5 font-medium">
                  Time
                </th>
                <th scope="col" className="w-28 px-3 py-5 font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {assignments.map((a) => (
                <tr
                  key={a.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:last-child>td:first-child]:rounded-bl-lg"
                >
                  <td className="py-3 pl-6 pr-3">
                    <p className="min-w-0 break-words font-medium">{a.name}</p>
                  </td>
                  <td className="px-3 py-3">
                    <StatusCell status={a.status} score={a.score} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{a.duration}</td>
                  <td className="whitespace-nowrap px-3 py-3">{a.questions}</td>
                  <td className="px-3 py-3">{a.deadline}</td>
                  <td className="px-3 py-3 text-center">
                    <PracticeActionButton
                      action={
                        a.status === "In Progress"
                          ? "continue"
                          : a.status === "Before Open"
                            ? "locked"
                            : "review"
                      }
                      disabled
                      id={a.id}
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
