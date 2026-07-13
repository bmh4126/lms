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
import { getStudentCards } from "../ui/student/curriculum/cards";
import { getTeacherCards } from "../ui/teacher/dashboard/cards";
import { getAdminCards } from "../ui/admin/cards";
import { getAssignmentCards } from "../ui/student/practice/assignments/cards";

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

export type Grade = {
  position: number;
  chapter_count: number;
};

export type ChapterListItem = {
  id: string;
  title: string;
  position: number;
  topic_count: number;
};

export type TopicListItem = {
  id: string;
  title: string;
  position: number;
  lesson_count: number;
};
export type LessonListItem = {
  id: string;
  title: string;
  position: number | string;
};

export type LessonDetail = {
  title: string;
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
};

export const typeCardList: Record<
  string,
  (userId: string) => Promise<Cards[]>
> = {
  student: getStudentCards,
  teacher: getTeacherCards,
  admin: getAdminCards,
};

export type UserTable = {
  id: string;
  name: string;
  email: string;
  grade: string;
  role: string;
  created_at: string;
};

export type UserForm = {
  id: string;
  name: string;
  email: string;
  grade: number;
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
  duration: string;
  deadline: Date;
  status: string;
  score?: string;
}

export type Exam = {
  id: string;
  name: string;
  duration: string;
  questions: number;
  status: "Before Open" | "In Progress" | "Done" | "Dued";
  deadline: string;
  score?: string; // e.g. "9/10" — only when status === "done"
};
