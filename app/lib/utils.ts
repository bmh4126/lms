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

const displayPlural = (n: number, label: string) =>
  n ? n.toString() + " " + label + (n > 1 ? "s " : " ") : "";

export const formatDuration = (duration: string) => {
  const parsedDuration = parseInt(duration);
  const hours = Math.floor(parsedDuration / 60);
  const minutes = parsedDuration - hours * 60;
  return displayPlural(hours, "hour") + displayPlural(minutes, "minute");
};
