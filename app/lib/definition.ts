import {
  PencilIcon,
  NumberedListIcon,
  ChartBarIcon,
  HomeIcon,
  NewspaperIcon,
  ShieldExclamationIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export type NavLink = {
  name: string;
  href: string;
  icon: IconName;
  options?: { name: string; href: string }[];
};

export type IconName =
  | "pencilIcon"
  | "numberedListIcon"
  | "chartBarIcon"
  | "homeIcon"
  | "newspaperIcon"
  | "shieldExclaimationIcon"
  | "bookOpenIcon"
  | "academicCapIcon"
  | "userIcon"
  | "checkCircleIcon"
  | "documentDuplicateIcon";

export const IconsMap = {
  pencilIcon: PencilIcon,
  numberedListIcon: NumberedListIcon,
  chartBarIcon: ChartBarIcon,
  homeIcon: HomeIcon,
  newspaperIcon: NewspaperIcon,
  shieldExclaimationIcon: ShieldExclamationIcon,
  bookOpenIcon: BookOpenIcon,
  academicCapIcon: AcademicCapIcon,
  userIcon: UserIcon,
  checkCircleIcon: CheckCircleIcon,
  documentDuplicateIcon: DocumentDuplicateIcon,
};

export type Cards = {
  title: string;
  value: number | string;
  type: IconName;
};

export type ChapterListItem = {
  id: string;
  name: string;
  position: number;
  topic_count: number;
};

export type TopicListItem = {
  id: string;
  name: string;
  position: number;
  lesson_count: number;
};
export type LessonListItem = {
  id: string;
  name: string;
  position: number | string;
};

export type LessonDetail = {
  name: string;
  position: string | number;
  video_url: string;
};

export type Role = "student" | "teacher" | "admin";

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
  password: string;
  grade?: number;
};

export type StudentTable = {
  id: string;
  name: string;
  email: string;
  label: string;
  created_at: Date;
};

export type StudentForm = {
  id: string;
  name: string;
  email: string;
  grade: number;
};

export type TeacherTable = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
};

export type TeacherForm = {
  id: string;
  name: string;
  email: string;
};

export type Assignment = {
  id: string;
  name: string;
  duration: string;
  questions: number;
  status: "In Progress" | "Done" | "Dued";
  deadline: string;
  score?: string; // e.g. "9/10" — only when status === "done"
};

export type AssignmentRow = {
  id: string;
  name: string;
  close: Date;
  status: "In Progress" | "Dued" | "Done";
  score?: string;
};

export type ExamRow = {
  id: string;
  name: string;
  duration: string;
  question_count: number;
  status: "Before Open" | "In Progress" | "Done" | "Dued";
  start: Date;
  score?: string;
};
