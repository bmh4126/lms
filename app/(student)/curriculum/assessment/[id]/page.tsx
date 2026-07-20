import { Metadata } from "next";
import Back from "@/app/ui/back";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  fetchAssessmentAttempt,
  fetchQuestionsById,
  fetchAnswersAndScoreForReview,
} from "@/app/lib/data/student/data";
import {
  deriveAssessmentMode,
  getAssessmentPolicy,
  formatDateToTime,
} from "@/app/lib/utils";
import QuestionsWrapper from "@/app/ui/student/practice/questions";
import { ReviewScore } from "@/app/ui/student/practice/score";

export const metadata: Metadata = {
  title: "Assessment",
};

// One route for both doing and reviewing. The mode is derived from submission
// state + timing (see deriveAssessmentMode) — never from the URL — so a student
// can't force "review" to leak the answer key.
export default async function Page(prop: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await prop.params;

  const user = await auth();
  if (!user) notFound();
  const userId = user.user.id;
  if (!userId) notFound();

  const assessment = await fetchAssessmentAttempt(id, userId);
  if (!assessment) notFound();

  const policy = getAssessmentPolicy(assessment.type);
  const mode = deriveAssessmentMode(
    assessment.open,
    assessment.close,
    assessment.score,
    policy.singleAttempt,
  );

  // Locked: either before open, or a submitted exam whose window is still open
  // (a submission `score` distinguishes the two).
  if (mode === "locked") {
    return (
      <>
        <Back href="/curriculum/assessment" />
        <div className="mt-10 text-center">
          <h1 className="text-xl font-bold text-gray-900">{assessment.name}</h1>
          <p className="mt-2 text-gray-500">
            {assessment.score
              ? `Submitted — you can review your answers after this closes on ${formatDateToTime(assessment.close)}.`
              : `Opens on ${formatDateToTime(assessment.open)}`}
          </p>
        </div>
      </>
    );
  }

  // Interactive attempt. Correct answers must NOT be fetched here.
  if (mode === "do") {
    return (
      <>
        <Back href="/curriculum/assessment" />
        {/* TODO: reusable question runner — fetch questions WITHOUT is_correct
            and feed `policy` to toggle timer / single-attempt / leave-guard. */}
        <p className="mt-4">
          Do {assessment.type}: {assessment.name}
        </p>
        <pre className="mt-2 text-xs text-gray-500">
          {JSON.stringify(policy, null, 2)}
        </pre>
      </>
    );
  }

  // Review (submitted) OR missed (closed, never submitted). Both reveal the
  // correct answers so the student can learn. A missed attempt just has no
  // selections and a zero score.
  const full = await fetchQuestionsById(id);
  let answers: string[] = [];
  let score = 0;
  if (mode === "review") {
    const result = await fetchAnswersAndScoreForReview(userId, id);
    answers = result.answers;
    score = result.score;
  }

  return (
    <>
      <div className="relative mb-4 flex items-center">
        <Back href="/curriculum/assessment" />
        <p className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate text-center text-lg font-bold text-gray-900 sm:text-2xl md:text-3xl">
          {full.name}
        </p>
      </div>
      {mode === "missed" && (
        <p className="mb-4 text-center text-sm text-gray-500">
          You didn&apos;t attempt this. Here are the correct answers.
        </p>
      )}
      <ReviewScore score={score} total={full.questions.length} />
      <div className="mt-4">
        {full.questions.map((q, i) => (
          <QuestionsWrapper
            key={q.id}
            index={i + 1}
            question={q}
            answer={answers[i]}
          />
        ))}
      </div>
    </>
  );
}
