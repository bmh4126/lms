import Back from "@/app/ui/back";
import { Metadata } from "next";
import QuestionsWrapper from "@/app/ui/student/practice/questions";
import { ReviewScore } from "@/app/ui/student/practice/score";
import {
  fetchQuestionsById,
  fetchAnswersAndScoreForReview,
  fetchAssessmentById,
} from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Review exam",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) notFound();
  const userId = user.user.id;
  if (!userId) notFound();
  const { id } = await prop.params;

  const [questions, { answers, score }, name] = await Promise.all([
    fetchQuestionsById(id),
    fetchAnswersAndScoreForReview(userId, id),
    fetchAssessmentById(id),
  ]);

  return (
    <>
      <div className="relative mb-4 flex items-center">
        <Back href="/curriculum/practice/exam/" />
        <p className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate text-center text-lg font-bold text-gray-900 sm:text-2xl md:text-3xl">
          {name}
        </p>
      </div>
      <ReviewScore score={score} total={questions.length} />
      <div className="mt-4">
        {questions.map((q, i) => (
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
