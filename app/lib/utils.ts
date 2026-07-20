import { Assessment } from "./definition";

// Only allow a same-site absolute path as a redirect target — blocks open
// redirects like "https://evil.com" or protocol-relative "//evil.com".
export function safeCallback(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") && !url.startsWith("//") ? url : undefined;
}

// Restrictions for the "do" flow. Exams are locked down (timed, one attempt,
// leave-guard, no early review); assignments are relaxed. The same do component
// consumes this to toggle its behavior.
export type AssessmentPolicy = {
  timed: boolean;
  singleAttempt: boolean;
  lockOnLeave: boolean;
  canReviewBeforeClose: boolean;
};

export function getAssessmentPolicy(
  type: "assignment" | "exam",
): AssessmentPolicy {
  return type === "exam"
    ? {
        timed: true,
        singleAttempt: true,
        lockOnLeave: true,
        canReviewBeforeClose: false,
      }
    : {
        timed: false,
        singleAttempt: false,
        lockOnLeave: false,
        canReviewBeforeClose: true,
      };
}

// Combine a datetime-local value (a wall-clock string with no zone, e.g.
// "2026-07-20T09:00") with an ISO offset (e.g. "+07:00") into a Date at the
// correct UTC instant — ready to store in a timestamp column.
export function localTimeToDate(localDateTime: string, offset: string): Date {
  const date = new Date(`${localDateTime}${offset}`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date/time: "${localDateTime}${offset}"`);
  }
  return date;
}

// Inverse of localTimeToDate: turn a UTC Date into a datetime-local wall-clock
// string ("YYYY-MM-DDTHH:mm") in the given offset — e.g. to prefill an edit
// form's <input type="datetime-local">. Defaults to GMT+7.
export function dateToLocalTime(d: Date, offset: string = "+07:00"): string {
  if (Number.isNaN(d.getTime())) {
    throw new Error("dateToLocalTime: invalid Date");
  }
  // Parse "+07:00" / "-05:30" into signed minutes.
  const sign = offset.startsWith("-") ? -1 : 1;
  const [oh, om] = offset.replace(/[+-]/, "").split(":").map(Number);
  const offsetMinutes = sign * (oh * 60 + om);

  // Shift the instant by the offset, then read the UTC parts — they now spell
  // the wall-clock time in that zone.
  const shifted = new Date(d.getTime() + offsetMinutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = shifted.getUTCFullYear();
  const mo = pad(shifted.getUTCMonth() + 1);
  const da = pad(shifted.getUTCDate());
  const hh = pad(shifted.getUTCHours());
  const mi = pad(shifted.getUTCMinutes());
  return `${yyyy}-${mo}-${da}T${hh}:${mi}`;
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [
      1,
      2,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export type AssignmentStatus = "In Progress" | "Done" | "Dued";

// Status isn't stored — it's derived from whether the work is finished
// (has a score) and whether the deadline has passed relative to now.
export const deriveAssignmentStatus = (
  deadline: Date,
  score?: string,
): AssignmentStatus => {
  if (score) return "Done";
  if (new Date(deadline).getTime() < Date.now()) return "Dued";
  return "In Progress";
};

export const formatDateToLocal = (dateStr: Date, locale: string = "en-US") => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// Formats a DB timestamp as "hh:mm, Mon dd, yyyy" e.g. "10:18, Jul 07, 2026".
// Composed from two formatters because Intl orders date-before-time in en-US.
export const formatDateToTime = (dateStr: Date, locale: string = "en-US") => {
  const date = new Date(dateStr);
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const day = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
  return `${time}, ${day}`;
};

const displayPlural = (n: number, label: string) =>
  n ? n.toString() + " " + label + (n > 1 ? "s " : " ") : "";

export const formatDuration = (open: Date, close: Date) => {
  const parsedDuration = MstoMinute(close.getTime() - open.getTime());
  const minutes = parsedDuration % 60;
  const parsedDurationHours = (parsedDuration - minutes) / 60;
  const hours = parsedDurationHours % 24;
  const parsedDurationDays = (parsedDurationHours - hours) / 24;
  const days = parsedDurationDays % 7;
  const parsedDurationWeeks = (parsedDurationDays - days) / 7;
  const weeks = parsedDurationWeeks % 52;
  const years = Math.floor(((parsedDurationWeeks - weeks) * 7) / 365);
  return (
    displayPlural(years, "year") +
    displayPlural(weeks, "week") +
    displayPlural(days, "day") +
    displayPlural(hours, "hour") +
    displayPlural(minutes, "minute")
  );
};

export const MstoMinute = (duration: number) => duration / 60 / 1000;

export const passedTime = (point: Date) => point.getTime() < Date.now();

// What the single /assessment/[id] page should show, derived from state — NOT
// from the URL.
//   locked: before open, OR a single-attempt exam already submitted (still open).
//   do:     open and either not submitted, or a multi-attempt assignment the
//           student can keep editing before close.
//   review: submitted and past close — full review with the student's answers.
//   missed: past close with no submission — review with the key, no selections.
export type AssessmentMode = "locked" | "do" | "review" | "missed";

export function deriveAssessmentMode(
  open: Date,
  close: Date,
  score: string | null | undefined,
  singleAttempt: boolean,
): AssessmentMode {
  if (!passedTime(open)) return "locked";
  if (!passedTime(close)) {
    // Window still open.
    if (!score) return "do"; //                 not submitted yet
    return singleAttempt ? "locked" : "do"; //  exam: locked; assignment: continue
  }
  // Window closed.
  return score ? "review" : "missed";
}

// Ordering:
//  1) "Before Open" exams come first, most upcoming first (ascending start:
//     among future starts the smallest start - now is the earliest start).
//  2) All other exams follow, ordered by start descending (newest first).
export const compareExams = (a: Assessment, b: Assessment) => {
  const aBeforeOpen = a.status === "Before Open";
  const bBeforeOpen = b.status === "Before Open";

  // Before Open group always sorts ahead of the rest
  if (aBeforeOpen !== bBeforeOpen) return aBeforeOpen ? -1 : 1;

  // Within Before Open: soonest to open first
  if (aBeforeOpen) return a.open.getTime() - b.open.getTime();

  // Everyone else: most recent first
  return b.open.getTime() - a.open.getTime();
};
