"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Selector({ grades }: { grades: number[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Default to "all" so the page shows everything on first load.
  const grade = searchParams.get("grade") ?? "all";

  // Write filters to the URL. `undefined` leaves a key untouched; an empty
  // string removes it. Any change resets pagination to page 1.
  function updateParams(next: { grade?: string }) {
    const params = new URLSearchParams(searchParams);
    if (next.grade !== undefined) {
      next.grade ? params.set("grade", next.grade) : params.delete("grade");
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

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
          className="peer block w-full cursor-pointer truncate rounded-md border border-gray-200 py-2 pl-4 pr-8 text-sm outline-2"
          value={grade}
          onChange={(e) => updateParams({ grade: e.target.value })}
        >
          <option value="all">All grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
