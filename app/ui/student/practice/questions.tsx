import { Option, Question } from "@/app/lib/definition";
import clsx from "clsx";

// Review mode is read-only. Each option lands in exactly one visual state,
// derived purely from `is_correct` (the answer key) and whether the student
// picked it. No internal state — this is a presentational component.
type OptionState =
  | "correct-selected" // student chose it, and it was right
  | "wrong-selected" //  student chose it, but it was wrong
  | "correct" //         student didn't choose it, but it was the right answer
  | "default"; //        not chosen, not the answer

function getOptionState(option: Option, selected: boolean): OptionState {
  if (selected && option.is_correct) return "correct-selected";
  if (selected && !option.is_correct) return "wrong-selected";
  if (option.is_correct) return "correct";
  return "default";
}

const STATE_LABEL: Record<OptionState, string | null> = {
  "correct-selected": "✓ Your answer",
  "wrong-selected": "✕ Your answer",
  correct: "Correct answer",
  default: null,
};

export function QuestionsOption({
  option,
  selected,
}: {
  option: Option;
  selected: boolean;
}) {
  const state = getOptionState(option, selected);
  const tag = STATE_LABEL[state];
  return (
    <div
      className={clsx(
        "flex w-full items-center justify-between gap-2 rounded-md border-2 p-3 text-left text-sm shadow-md/30",
        {
          "border-green-500 bg-green-100 text-green-900":
            state === "correct-selected",
          "border-red-500 bg-red-100 text-red-900": state === "wrong-selected",
          "border-green-400 bg-green-50 text-green-800": state === "correct",
          "border-gray-200 bg-gray-50 text-gray-500": state === "default",
        },
      )}
    >
      <span className="min-w-0 break-words">{option.label}</span>
      {tag && (
        <span className="whitespace-nowrap text-xs font-medium">{tag}</span>
      )}
    </div>
  );
}

export default function QuestionsWrapper({
  index,
  question,
  answer,
}: {
  index: number;
  question: Question;
  answer: string;
}) {
  // jsonb_agg returns null for a question with no options — guard it.
  const options = question.options ?? [];
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md/30">
      <p className="mb-3 font-medium">
        Question {index}: {question.label}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <QuestionsOption key={o.id} option={o} selected={answer === o.id} />
        ))}
      </div>
    </div>
  );
}
