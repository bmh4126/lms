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

export type Curriculum = {
  grade: string | number;
  chapters: Chapter[];
};

export type Chapter = {
  title: string;
  position: string | number;
  topics: Topic[];
};

export type Topic = {
  title: string;
  position: number | string;
  lessons: LessonListItem[];
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

export const roleCardList: Record<string,()=> Promise<Cards[]>> = {
  student: getStudentCards,
  teacher: getTeacherCards,
  admin: getAdminCards,
};
