import { Assessment } from "@/app/lib/definition";
import clsx from "clsx";

export function StatusCell({ assessment }: { assessment: Assessment }) {
  const status = assessment.status;
  const score = assessment.score
    ? assessment.score + "/" + assessment.question_count
    : null;
  if (status === "Done") {
    return (
      <div className="flex items-center gap-2">
        <span className="shadow-md/30 w-full flex justify-center items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-md font-medium text-green-700">
          {score}
        </span>
      </div>
    );
  }
  return (
    <span
      className={clsx(
        `shadow-md/30 w-full flex justify-center items-center gap-1 rounded-full px-2 py-1 text-md font-medium text-center`,
        status === "Dued"
          ? "bg-red-200 text-red-500"
          : status === "Before Open"
            ? "border-gray-200 bg-gray-50 text-gray-500 shadow-none"
            : "bg-gray-100 text-gray-600",
      )}
    >
      {status}
    </span>
  );
}
