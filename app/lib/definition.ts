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

export type Class = {
  id: string;
  label: string;
  grade_level: number;
}

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
  class: string;
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

export type Assessment = {
  id: string;
  name: string;
  question_count: number;
  status: "Before Open" | "In Progress" | "Done" | "Dued";
  open: Date;
  close: Date;
  type: "assignment" | "exam";
  score?: string;
};

export type Question = {
  id: string;
  label: string;
  options: Option[];
}

export type Option = {
  id: string;
  label: string;
  is_correct: boolean;
}