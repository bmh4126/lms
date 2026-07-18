"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export type OptionDraft = { id: string; label: string };
export type QuestionDraft = {
  id: string;
  label: string;
  options: OptionDraft[];
  correctOptionId: string | null;
};

// A question is complete when it has a name, at least two labelled options, and
// exactly one of those options marked correct.
export function questionsValid(questions: QuestionDraft[]): boolean {
  if (questions.length === 0) return false;
  return questions.every(
    (q) =>
      q.label.trim() !== "" &&
      q.options.length >= 2 &&
      q.options.every((o) => o.label.trim() !== "") &&
      q.correctOptionId !== null &&
      q.options.some((o) => o.id === q.correctOptionId),
  );
}

export default function QuestionsBuilder({
  onValidityChange,
}: {
  onValidityChange: (ok: boolean) => void;
}) {
  // One empty question to start. Fixed id "q0" so SSR and client match; all
  // later ids come from a client-only counter (handlers never run on server).
  const [questions, setQuestions] = useState<QuestionDraft[]>(() => [
    { id: "q0", label: "", options: [], correctOptionId: null },
  ]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["q0"]));
  const counter = useRef(1);
  const genId = (prefix: string) => `${prefix}${counter.current++}`;

  // Report validity up whenever the questions change.
  useEffect(() => {
    onValidityChange(questionsValid(questions));
  }, [questions, onValidityChange]);

  function patchQuestion(qid: string, patch: (q: QuestionDraft) => QuestionDraft) {
    setQuestions((qs) => qs.map((q) => (q.id === qid ? patch(q) : q)));
  }

  function addQuestion() {
    const id = genId("q");
    setQuestions((qs) => [
      ...qs,
      { id, label: "", options: [], correctOptionId: null },
    ]);
    setExpanded((s) => new Set(s).add(id));
  }

  function removeQuestion(qid: string) {
    setQuestions((qs) => (qs.length > 1 ? qs.filter((q) => q.id !== qid) : qs));
  }

  function toggleExpand(qid: string) {
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  }

  function addOption(qid: string) {
    const id = genId("o");
    patchQuestion(qid, (q) => ({
      ...q,
      options: [...q.options, { id, label: "" }],
    }));
  }

  function removeOption(qid: string, oid: string) {
    patchQuestion(qid, (q) => ({
      ...q,
      options: q.options.filter((o) => o.id !== oid),
      // If the removed option was the correct one, clear the selection.
      correctOptionId: q.correctOptionId === oid ? null : q.correctOptionId,
    }));
  }

  // No width baked in — callers add `w-full` (block field) or `flex-1 min-w-0`
  // (row field, so it shares the row with buttons without overflowing).
  const fieldClass =
    "rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500";
  const iconBtn = "shrink-0 rounded-md border p-2 hover:opacity-80";

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">
          Questions
          <span className="ml-1 text-red-500">*</span>
        </p>
        <span className="text-xs text-gray-500">At least one required</span>
      </div>

      <div className="space-y-3">
        {questions.map((q, qi) => {
          const isOpen = expanded.has(q.id);
          return (
            <div
              key={q.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              {/* Header: expand/collapse + delete */}
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(q.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <ChevronDownIcon
                    className={clsx(
                      "h-4 w-4 shrink-0 transition-transform",
                      !isOpen && "-rotate-90",
                    )}
                  />
                  <span className="min-w-0 truncate font-medium">
                    {q.label.trim() || `Question ${qi + 1}`}
                  </span>
                </button>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className={`${iconBtn} bg-red-500`}
                    aria-label="Delete question"
                  >
                    <TrashIcon className="w-5 stroke-white" />
                  </button>
                )}
              </div>

              {/* Body */}
              {isOpen && (
                <div className="space-y-4 border-t border-gray-100 px-4 py-4">
                  {/* Label */}
                  <div>
                    <label
                      htmlFor={`label-${q.id}`}
                      className="mb-1 block text-sm font-medium"
                    >
                      Question
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id={`label-${q.id}`}
                      value={q.label}
                      onChange={(e) =>
                        patchQuestion(q.id, (x) => ({
                          ...x,
                          label: e.target.value,
                        }))
                      }
                      placeholder="Enter the question"
                      className={`block w-full ${fieldClass}`}
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Options
                        <span className="ml-1 text-red-500">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => addOption(q.id)}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:opacity-80"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add option
                      </button>
                    </div>
                    {q.options.length === 0 ? (
                      <p className="text-xs text-gray-500">
                        Add at least two options.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {q.options.map((o, oi) => {
                          const isCorrect = q.correctOptionId === o.id;
                          return (
                            <div key={o.id} className="flex items-center gap-2">
                              <input
                                value={o.label}
                                onChange={(e) =>
                                  patchQuestion(q.id, (x) => ({
                                    ...x,
                                    options: x.options.map((op) =>
                                      op.id === o.id
                                        ? { ...op, label: e.target.value }
                                        : op,
                                    ),
                                  }))
                                }
                                placeholder={`Option ${oi + 1}`}
                                className={`min-w-0 flex-1 ${fieldClass}`}
                              />
                              {/* Mark this option as the correct answer (toggle;
                                  at most one per question). */}
                              <button
                                type="button"
                                onClick={() =>
                                  patchQuestion(q.id, (x) => ({
                                    ...x,
                                    correctOptionId: isCorrect ? null : o.id,
                                  }))
                                }
                                aria-pressed={isCorrect}
                                aria-label="Mark as correct answer"
                                title="Mark as correct answer"
                                className={clsx(
                                  iconBtn,
                                  isCorrect
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300 bg-white",
                                )}
                              >
                                <CheckIcon
                                  className={clsx(
                                    "w-5",
                                    isCorrect
                                      ? "stroke-white"
                                      : "stroke-gray-400",
                                  )}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeOption(q.id, o.id)}
                                className={`${iconBtn} border-transparent bg-gray-400`}
                                aria-label="Delete option"
                              >
                                <TrashIcon className="w-5 stroke-white" />
                              </button>
                            </div>
                          );
                        })}
                        {!q.correctOptionId && (
                          <p className="text-xs text-gray-500">
                            Mark the correct answer with the ✓ button.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600"
      >
        <PlusIcon className="h-5 w-5" />
        Add question
      </button>

      {/* Bridge to the form submission — the server action parses this JSON. */}
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />
    </div>
  );
}
