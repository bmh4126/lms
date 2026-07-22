"use client";

import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ClassStudent,
  StudentGroup,
  StudentSearchResult,
} from "@/app/lib/definition";
import { searchStudentsByCardId } from "@/app/lib/data/teacher/data";
import { importStudentsFromFile } from "@/app/lib/action/class/action";

// The four groups + their dot colors. Newly added / imported students default
// to "mid" until the teacher classifies them.
const GROUPS: { value: StudentGroup; label: string; dot: string }[] = [
  { value: "struggling", label: "Struggling", dot: "bg-red-300" },
  { value: "mid", label: "Mid", dot: "bg-amber-300" },
  { value: "good", label: "Good", dot: "bg-green-300" },
  { value: "excellent", label: "Excellent", dot: "bg-blue-300" },
];
const DEFAULT_GROUP: StudentGroup = "mid";
const dotOf = (g: StudentGroup) => GROUPS.find((x) => x.value === g)?.dot;

// Controlled by the form: `students` is the current membership (each with a
// group). A single hidden input submits [{ id, group }] as JSON.
export default function StudentPicker({
  students,
  setStudents,
}: {
  students: ClassStudent[];
  setStudents: Dispatch<SetStateAction<ClassStudent[]>>;
}) {
  console.log(students);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentSearchResult[]>([]);
  const [focused, setFocused] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // Index of the last row clicked, for shift-range selection.
  const anchorRef = useRef<number | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importWarning, setImportWarning] = useState("");
  // Derived: open only while the input is focused and there are results.
  const open = focused && results.length > 0;

  // Fetch matches; an empty query returns the first 5, so focusing shows a list.
  async function fetchStudents(q: string) {
    const rows = await searchStudentsByCardId(q);
    // Hide students already added.
    setResults(rows.filter((r) => !students.some((s) => s.id === r.id)));
  }
  // Debounce while typing; focus calls fetchStudents directly for an instant list.
  const runSearch = useDebouncedCallback(fetchStudents, 300);

  // Bulk import from a csv/xlsx/xls file. Imported students default to "mid".
  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be re-selected later
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const { matched, notFound, error } = await importStudentsFromFile(fd);
    setStudents((prev) => {
      const merged = [...prev];
      for (const m of matched) {
        if (!merged.some((s) => s.id === m.id)) {
          merged.push({ ...m, group: m.group ?? DEFAULT_GROUP });
        }
      }
      return merged;
    });
    setImportErrors(notFound);
    setImportWarning(
      error ??
        (matched.length === 0 && notFound.length === 0
          ? "Nothing was imported from this file."
          : ""),
    );
  }

  // Download a sample CSV so teachers know the expected columns/format.
  function downloadTemplate() {
    const csv =
      "name,card_id,group\nJohn Doe,10001,excellent\nJane Smith,10002,good\nAdam Smith,10002,mid\nAlex Doe,10002,struggling\n";
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "students-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function add(s: StudentSearchResult) {
    setResults((prev) => prev.filter((p) => p.id !== s.id));
    setStudents((prev) =>
      prev.some((p) => p.id === s.id)
        ? prev
        : [...prev, { ...s, group: DEFAULT_GROUP }],
    );
    if (results.length === 1) inputRef.current?.blur();
  }

  function remove(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setChecked((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function toggleChecked(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Click toggles one; Shift-click selects every row between the anchor and here.
  function handleRowClick(e: MouseEvent<HTMLDivElement>, index: number) {
    if (e.shiftKey && anchorRef.current !== null) {
      const start = Math.min(anchorRef.current, index);
      const end = Math.max(anchorRef.current, index);
      setChecked((prev) => {
        const next = new Set(prev);
        for (let i = start; i <= end; i++) next.add(students[i].id);
        return next;
      });
    } else {
      toggleChecked(students[index].id);
      anchorRef.current = index;
    }
  }

  const allChecked =
    students.length > 0 && students.every((s) => checked.has(s.id));

  function toggleAll() {
    setChecked(allChecked ? new Set() : new Set(students.map((s) => s.id)));
  }

  // Set the group on the given ids (one row, or the whole selection).
  function assignGroup(ids: Iterable<string>, group: StudentGroup) {
    const idSet = new Set(ids);
    setStudents((prev) =>
      prev.map((s) => (idSet.has(s.id) ? { ...s, group } : s)),
    );
  }

  function bulkAssign(group: StudentGroup) {
    assignGroup(checked, group);
    setChecked(new Set());
  }

  const counts = GROUPS.map((g) => ({
    label: g.label,
    n: students.filter((s) => s.group === g.value).length,
  }));

  return (
    <div>
      {/* Label + template/upload on one line */}
      <div className="mb-2 flex items-center justify-between">
        <span className="flex text-sm font-medium">
          Students
          <span className="ml-1 text-red-500">*</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Template
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <ArrowUpTrayIcon className="h-4 w-4" />
            Upload list
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Search by card id */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            runSearch(e.target.value);
          }}
          onFocus={() => {
            setFocused(true);
            fetchStudents(query);
          }}
          onBlur={() => setFocused(false)}
          placeholder="Search students by card ID…"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

        {/* Results dropdown (≤5) */}
        {open && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  // Keep the input focused so this click isn't lost to onBlur.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(r)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-sky-50"
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="min-w-0 truncate text-gray-500">
                    {r.card_id}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chosen students */}
      <div className="mt-3">
        {students.length === 0 ? (
          <p className="text-xs text-gray-500">Add at least one student.</p>
        ) : (
          <>
            {/* Bulk action bar — always rendered so the layout never shifts;
                its actions are disabled until something is selected. */}
            <div className="mb-2 flex flex-wrap items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs">
              <span className="font-medium text-blue-700">
                {checked.size > 0 ? `${checked.size} selected` : "Set group:"}
              </span>
              {GROUPS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  disabled={checked.size === 0}
                  onClick={() => bulkAssign(g.value)}
                  className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className={`h-2 w-2 rounded-full ${g.dot}`} />
                  {g.label}
                </button>
              ))}
              <button
                type="button"
                disabled={checked.size === 0}
                onClick={() => setChecked(new Set())}
                className="ml-auto text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {/* Header: select all + per-group counts */}
            <div className="mb-1 flex items-center justify-between px-1 text-xs text-gray-500">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                />
                Select all ({students.length})
              </label>
              <span>{counts.map((c) => `${c.label} ${c.n}`).join(" · ")}</span>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {students.map((s, i) => (
                <div
                  key={s.id}
                  // Click toggles; Shift-click selects the range from the last
                  // click. The group picker and delete button stopPropagation.
                  onClick={(e) => handleRowClick(e, i)}
                  // Shift+mousedown is what starts the browser's cross-row text
                  // selection — stop it so ranges don't get highlighted.
                  onMouseDown={(e) => {
                    if (e.shiftKey) e.preventDefault();
                  }}
                  className={clsx(
                    "flex cursor-pointer select-none items-center gap-2 rounded-md border px-3 py-2 text-sm",
                    checked.has(s.id)
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked.has(s.id)}
                    readOnly
                    className="pointer-events-none shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{s.name}</span> ({s.card_id})
                  </span>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${dotOf(s.group)}`}
                  />
                  <select
                    aria-label="Group"
                    value={s.group}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      assignGroup([s.id], e.target.value as StudentGroup)
                    }
                    className={`${GROUPS.filter((g) => g.value === s.group)[0]?.dot}
                    shrink-0 cursor-pointer rounded-md border border-gray-200 py-1 pl-2 pr-6 text-xs`}
                  >
                    {GROUPS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(s.id);
                    }}
                    aria-label="Remove student"
                    className="shrink-0 rounded p-1 hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Submitted as JSON: [{ id, group }] */}
            <input
              type="hidden"
              name="students"
              value={JSON.stringify(
                students.map((s) => ({ id: s.id, group: s.group })),
              )}
            />
          </>
        )}
      </div>

      {/* File-level warning (unreadable / empty / nothing imported) */}
      {importWarning && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          {importWarning}
        </div>
      )}

      {/* Upload errors: rows that matched no student */}
      {importErrors.length > 0 && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          <p className="mb-1 font-medium">
            {importErrors.length} not found (skipped):
          </p>
          <ul className="list-disc pl-4">
            {importErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
