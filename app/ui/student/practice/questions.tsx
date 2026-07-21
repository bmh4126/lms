"use client";

import { Option, Question } from "@/app/lib/definition";
import clsx from "clsx";

// One option in one of five visual states. In review (`reveal`) the answer key
// drives correct/wrong/correct-selected; in do mode it's just selected/default.
type OptionState =
  | "correct-selected" // reveal: chose it, and it was right
  | "wrong-selected" //  reveal: chose it, but it was wrong
  | "correct" //         reveal: didn't choose it, but it was the answer
  | "selected" //        do: currently chosen
  | "default"; //        not chosen

function getOptionState(
  option: Option,
  selected: boolean,
  reveal: boolean,
): OptionState {
  if (reveal) {
    if (selected && option.is_correct) return "correct-selected";
    if (selected && !option.is_correct) return "wrong-selected";
    if (option.is_correct) return "correct";
    return "default";
  }
  return selected ? "selected" : "default";
}

const STATE_LABEL: Record<OptionState, string | null> = {
  "correct-selected": "✓ Your answer",
  "wrong-selected": "✕ Your answer",
  correct: "Correct answer",
  selected: null,
  default: null,
};

export function QuestionsOption({
  option,
  selected,
  reveal = true,
  onSelect,
}: {
  option: Option;
  selected: boolean;
  reveal?: boolean;
  onSelect?: () => void;
}) {
  const state = getOptionState(option, selected, reveal);
  const tag = STATE_LABEL[state];
  const className = clsx(
    "flex w-full items-center justify-between gap-2 rounded-md border-2 p-3 text-left text-sm shadow-md/30",
    {
      "border-green-500 bg-green-100 text-green-900":
        state === "correct-selected",
      "border-red-500 bg-red-100 text-red-900": state === "wrong-selected",
      "border-green-400 bg-green-50 text-green-800": state === "correct",
      "border-blue-500 bg-blue-100 text-blue-900": state === "selected",
      "border-gray-200 bg-gray-50 text-gray-500": state === "default",
    },
    onSelect && "cursor-pointer hover:opacity-80",
  );

  const content = (
    <>
      <span className="min-w-0 break-words">{option.label}</span>
      {tag && (
        <span className="whitespace-nowrap text-xs font-medium">{tag}</span>
      )}
    </>
  );

  // Interactive (do) → clickable button; read-only (review) → plain box.
  return onSelect ? (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={className}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default function QuestionsWrapper({
  index,
  question,
  answer,
  reveal = true,
  onSelect,
}: {
  index: number;
  question: Question;
  answer?: string;
  reveal?: boolean;
  onSelect?: (optionId: string) => void;
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
          <QuestionsOption
            key={o.id}
            option={o}
            selected={answer === o.id}
            reveal={reveal}
            onSelect={onSelect ? () => onSelect(o.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
