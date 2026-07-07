import {
  PencilIcon,
  NumberedListIcon,
  ChartBarIcon,
  HomeIcon,
  NewspaperIcon,
  ShieldExclamationIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { getStudentCards } from "../ui/curriculum/cards";
import { getTeacherCards } from "../ui/dashboard/cards";
import { getAdminCards } from "../ui/admin/cards";

export type NavLink = {
  name: string;
  href: string;
  icon: IconName;
};

export type IconName =
  | "study"
  | "practice"
  | "record"
  | "dashboard"
  | "report"
  | "analysis"
  | "test"
  | "chapter";

export const IconsMap = {
  study: PencilIcon,
  practice: NumberedListIcon,
  record: ChartBarIcon,
  dashboard: HomeIcon,
  report: NewspaperIcon,
  analysis: ChartBarIcon,
  test: ShieldExclamationIcon,
  chapter: BookOpenIcon,
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

export const roleCardList: Record<
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

export type TeacherForm = {
  id: string;
  name: string;
  email: string;
  grade: number;
};
