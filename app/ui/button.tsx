import clsx from "clsx";
import Link from "next/link";
import { Assessment } from "../lib/definition";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PracticeActionButton({
  assessment,
}: {
  assessment: Assessment;
  }) {
  const type = assessment.type;
  const status = assessment.status;
  const id = assessment.id;
  const getLabel = (status: string): [string, string] => {
    switch (status) {
      case "Before Open":
        return [
          "Locked",
          "disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none",
        ];
      case "Done":
      case "Dued":
        return [
          "Review",
          "shadow-md/30 bg-gray-100 text-gray-700 hover:bg-gray-200",
        ];
      case "In Progress":
        return [
          "Continue",
          "shadow-md/30 bg-blue-500 text-white hover:bg-blue-400",
        ];
      default:
        return ["", ""];
    }
  };
  const [label, styles] = getLabel(status);
  const hrefLink = label === "Review" ? `/review` : ``;
  return (
    <>
      {label === "Locked" ? (
        <Link href="#">
          <button
            type="button"
            disabled={label === "Locked"}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${styles}`}
          >
            {label}
          </button>
        </Link>
      ) : (
        <Link href={`/curriculum/practice/${type}/${id}/${hrefLink}`}>
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${styles}`}
          >
            {label}
          </button>
        </Link>
      )}
    </>
  );
}
