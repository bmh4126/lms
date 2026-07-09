import Link from "next/link";
import clsx from "clsx";
import { formatDateToLocal } from "@/app/lib/utils";

// DRAFT UI — assignments/exams to do. Mock data; real fetching wired later.
// Columns: Name | Kind | Duration | Questions | Status (+ score when done).

type Assignment = {
  id: string;
  name: string;
  kind: "homework" | "exam" | "generated";
  duration: string;
  questions: number;
  status: "in_progress" | "done" | "dued";
  deadline: string;
  score?: string; // e.g. "9/10" — only when status === "done"
};

const assignments: Assignment[] = [
  {
    id: "1",
    name: "Addition within 10",
    kind: "homework",
    duration: "20 min",
    questions: 10,
    status: "done",
    deadline: "2026-07-07 10:18",
    score: "9/10",
  },
  {
    id: "2",
    name: "Comparing numbers",
    kind: "generated",
    duration: "15 min",
    questions: 8,
    status: "dued",
    deadline: "2026-07-07 10:18",
  },
  {
    id: "3",
    name: "Chapter 1 Exam",
    kind: "exam",
    duration: "45 min",
    questions: 20,
    status: "done",
    score: "17/20",
    deadline: "2026-07-07 10:18",
  },
  {
    id: "4",
    name: "Counting practice",
    kind: "homework",
    duration: "10 min",
    questions: 6,
    status: "in_progress",
    deadline: "2026-07-07 10:18",
  },
  {
    id: "5",
    name: "Shapes quiz",
    kind: "exam",
    duration: "30 min",
    questions: 12,
    status: "done",
    score: "11/12",
    deadline: "2026-07-07 10:18",
  },
];

function KindBadge({ kind }: { kind: Assignment["kind"] }) {
  return (
    <span
      className={clsx(
        `inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize`,
        kind === "exam"
          ? "bg-amber-100 text-amber-700"
          : kind === "homework"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600",
      )}
    >
      {kind}
    </span>
  );
}

function StatusCell({
  status,
  deadline,
  score,
}: {
  status: Assignment["status"];
  deadline: string;
  score?: string;
}) {
  console.log(deadline);
  if (status === "done") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          {score ? score : null}
        </span>
      </div>
    );
  }
  return (
    <span
      className={clsx(
        `inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium`,
        status === "dued"
          ? "bg-red-200 text-red-500"
          : "bg-gray-100 text-gray-600",
      )}
    >
      {deadline}
    </span>
  );
}

function ActionButton({ status }: { status: Assignment["status"] }) {
  const label = status === "done" ? "Review" : "Continue";
  const styles =
    status === "done"
      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
      : "bg-blue-500 text-white hover:bg-blue-400";
  return (
    <button
      type="button"
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${styles}`}
    >
      {label}
    </button>
  );
}

export default function AssignmentTable() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {assignments.map((a) => (
              <div key={a.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <p className="min-w-0 break-words text-lg font-medium">
                    {a.name}
                  </p>
                  <KindBadge kind={a.kind} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    <p>{a.duration}</p>
                    <p>{a.questions} questions</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusCell
                      status={a.status}
                      score={a.score}
                      deadline={a.deadline}
                    />
                    <ActionButton status={a.status} />
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
                <th scope="col" className="w-28 px-3 py-5 font-medium">
                  Kind
                </th>
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  Duration
                </th>
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  Questions
                </th>
                <th scope="col" className="w-1/4 px-3 py-5 font-medium">
                  Status
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
                    <KindBadge kind={a.kind} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{a.duration}</td>
                  <td className="whitespace-nowrap px-3 py-3">{a.questions}</td>
                  <td className="px-3 py-3">
                    <StatusCell
                      status={a.status}
                      score={a.score}
                      deadline={a.deadline}
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <ActionButton status={a.status} />
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
