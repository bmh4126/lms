import { ExamRow } from "./definition";

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

export const formatDuration = (duration: string) => {
  const parsedDuration = parseInt(duration);
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

export const durationToMs = (duration: string) =>
  parseInt(duration) * 60 * 1000;

export const closeTime = (start: Date, duration: string) =>
  new Date(start.getTime() + durationToMs(duration));

export const passedCloseTime = (close:Date) =>
  close.getTime() < Date.now();

export const passedOpenTime = (start: Date) =>
  start.getTime() < Date.now();

// Ordering:
//  1) "Before Open" exams come first, most upcoming first (ascending start:
//     among future starts the smallest start - now is the earliest start).
//  2) All other exams follow, ordered by start descending (newest first).
export const compareExams = (a: ExamRow, b: ExamRow) => {
  const aBeforeOpen = a.status === "Before Open";
  const bBeforeOpen = b.status === "Before Open";

  // Before Open group always sorts ahead of the rest
  if (aBeforeOpen !== bBeforeOpen) return aBeforeOpen ? -1 : 1;

  // Within Before Open: soonest to open first
  if (aBeforeOpen) return a.start.getTime() - b.start.getTime();

  // Everyone else: most recent first
  return b.start.getTime() - a.start.getTime();
};
