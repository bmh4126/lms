"use client";

import { Class } from "@/app/lib/definition";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Grade + Class + Type filters. Values:
//   ""    = blank / no filter (grade & class start blank; type defaults to All)
//   "all" = every grade / every class
//   else  = a specific grade level / class id / type
// The URL is the single source of truth; the server page reads these to fetch.
export default function Selector({
  grades,
  classes,
}: {
  grades: number[];
  classes: Class[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Default to "all" so the page shows everything on first load.
  const grade = searchParams.get("grade") ?? "all";
  const selectedClass = searchParams.get("class_id") ?? "all";
  const type = searchParams.get("type") ?? "";

  // Specific classes only when a specific grade is chosen.
  const classOptions =
    grade && grade !== "all"
      ? classes.filter((c) => String(c.grade_level) === grade)
      : [];

  // Write filters to the URL. `undefined` leaves a key untouched; an empty
  // string removes it. Any change resets pagination to page 1.
  function updateParams(next: {
    grade?: string;
    class_id?: string;
    type?: string;
  }) {
    const params = new URLSearchParams(searchParams);
    if (next.grade !== undefined) {
      next.grade ? params.set("grade", next.grade) : params.delete("grade");
    }
    if (next.class_id !== undefined) {
      next.class_id
        ? params.set("class_id", next.class_id)
        : params.delete("class_id");
    }
    if (next.type !== undefined) {
      next.type ? params.set("type", next.type) : params.delete("type");
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  // Fixed width + truncate + right padding so the box never resizes with its
  // options and long labels don't run under the native dropdown arrow.
  const selectClass =
    "peer block w-full cursor-pointer truncate rounded-md border border-gray-200 py-2 pl-4 pr-8 text-sm outline-2";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      {/* Grade */}
      <div className="w-full sm:w-44">
        <label htmlFor="grade" className="mb-2 flex text-sm font-medium">
          Choose Grade
        </label>
        <select
          id="grade"
          name="grade"
          className={selectClass}
          value={grade}
          onChange={(e) => updateParams({ grade: e.target.value, class_id: "" })}
        >
          <option value="all">All grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>

      {/* Class — disabled until a grade is picked */}
      <div className="w-full sm:w-44">
        <label htmlFor="class" className="mb-2 flex text-sm font-medium">
          Choose Class
        </label>
        <select
          id="class"
          name="class_id"
          className={selectClass}
          value={selectedClass}
          onChange={(e) => updateParams({ class_id: e.target.value })}
        >
          <option value="all">All classes</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type — defaults to all types */}
      <div className="w-full sm:w-44">
        <label htmlFor="type" className="mb-2 flex text-sm font-medium">
          Choose Type
        </label>
        <select
          id="type"
          name="type"
          className={selectClass}
          value={type}
          onChange={(e) => updateParams({ type: e.target.value })}
        >
          <option value="">All types</option>
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
        </select>
      </div>
    </div>
  );
}
