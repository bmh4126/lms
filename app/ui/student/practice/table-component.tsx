import clsx from "clsx";

export function StatusCell({
  status,
  score,
}: {
  status: string;
  score?: string;
}) {
  if (status === "Done") {
    return (
      <div className="flex items-center gap-2">
        <span className="shadow-md/30 w-full flex justify-center items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-md font-medium text-green-700">
          {score ? score + "/10" : null}
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
