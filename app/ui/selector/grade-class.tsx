"use client";

import { Class } from "@/app/lib/definition";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Two dependent selects: Grade and Class. Values:
//   ""    = blank, not chosen yet (a disabled placeholder)
//   "all" = every grade / every class
//   else  = a specific grade level / class id
// Changing grade resets class to blank. The page only fetches once BOTH are
// non-blank. When grade is "all", the only class option is "All classes".
export default function Selector({
  grades,
  classes,
}: {
  grades: number[];
  classes: Class[];
}) {
  // The URL is the single source of truth — the server page reads these params
  // to fetch. The selects just read from and write to them.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const grade = searchParams.get("grade") ?? "";
  const selectedClass = searchParams.get("class_id") ?? "";

  // Specific classes only when a specific grade is chosen ("all" and blank get
  // no per-class options — just the "All classes" entry below).
  const classOptions =
    grade && grade !== "all"
      ? classes.filter((c) => String(c.grade_level) === grade)
      : [];

  // Write grade/class_id to the URL. `undefined` leaves a key untouched; an
  // empty string removes it. Changing grade always clears class_id, since the
  // old class may not belong to the new grade.
  function updateParams(next: { grade?: string; class_id?: string }) {
    const params = new URLSearchParams(searchParams);
    if (next.grade !== undefined) {
      next.grade ? params.set("grade", next.grade) : params.delete("grade");
    }
    if (next.class_id !== undefined) {
      next.class_id
        ? params.set("class_id", next.class_id)
        : params.delete("class_id");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Grade */}
      <div className="flex-1">
        <label htmlFor="grade" className="mb-2 flex text-sm font-medium">
          Choose Grade
        </label>
        <div className="relative">
          <select
            id="grade"
            name="grade"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2"
            value={grade}
            onChange={(e) =>
              // Set grade and clear class_id in one URL update.
              updateParams({ grade: e.target.value, class_id: "" })
            }
          >
            <option value="" disabled>
              Select a grade
            </option>
            <option value="all">All grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Class — disabled until a grade is picked */}
      <div className="flex-1">
        <label htmlFor="class" className="mb-2 flex text-sm font-medium">
          Choose Class
        </label>
        <div className="relative">
          <select
            id="class"
            name="class_id"
            disabled={!grade}
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 disabled:cursor-not-allowed disabled:bg-gray-100"
            value={selectedClass}
            onChange={(e) => updateParams({ class_id: e.target.value })}
          >
            <option value="" disabled>
              {grade ? "Select a class" : "Select a grade first"}
            </option>
            <option value="all">All classes</option>
            {classOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
