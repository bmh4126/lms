"use client";

import { useEffect, useState } from "react";
import { Question } from "@/app/lib/definition";
import { AssessmentPolicy } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";
import QuestionsWrapper from "./questions";
import { submitAnswer } from "@/app/lib/action/assessment/action";

// The interactive "do" controller. Single owner of the student's selections
// (useState) — the question components below are controlled and report clicks
// via `onSelect`. This is also where a draft-save and the final submit hook in.
export default function AssessmentRunner({
  assessment_id,
  questions,
  policy,
  initialAnswers,
}: {
  assessment_id: string;
  questions: Question[];
  policy: AssessmentPolicy;
  initialAnswers?: Record<string, string>;
}) {
  // questionId -> chosen optionId. Seeded from any saved selections so an
  // in-progress assignment continues where the student left off.
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialAnswers ?? {},
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const allAnswered = answeredCount === questions.length;

  // Lock the page scroll while the modal is open.
  useEffect(() => {
    if (!confirmOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [confirmOpen]);

  function select(questionId: string, optionId: string) {
    setAnswers((prev) => {
      // Re-clicking the chosen option clears it.
      if (prev[questionId] === optionId) {
        const { [questionId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [questionId]: optionId };
    });
  }

  // Submit — but warn first if there are unanswered questions.
  function handleSubmit() {
    if (!allAnswered) {
      setConfirmOpen(true);
      return;
    }
    doSubmit();
  }

  async function doSubmit() {
    setConfirmOpen(false);
    setError("");
    // On success the action redirects; only an error state returns here.
    const res = await submitAnswer(assessment_id, answers);
    if (res?.message) setError(res.message);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Answered {answeredCount}/{questions.length}
        </span>
        {policy.timed && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            Timed
          </span>
        )}
      </div>

      {questions.map((q, i) => (
        <QuestionsWrapper
          key={q.id}
          index={i + 1}
          question={q}
          reveal={false}
          answer={answers[q.id]}
          onSelect={(optionId) => select(q.id, optionId)}
        />
      ))}

      <div className="mt-2 flex items-center justify-end gap-3">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      {/* Unanswered-questions confirmation — a fixed, centered overlay so it
          never adds to page flow; body scroll is locked while it's open. */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Some questions aren&apos;t answered
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You&apos;ve answered {answeredCount} of {questions.length}. Submit
              anyway? Unanswered questions will be marked wrong.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doSubmit}
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400"
              >
                Submit anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
