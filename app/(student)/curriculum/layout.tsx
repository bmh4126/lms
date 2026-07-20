import SideNav from "@/app/ui/sidenav";
import { ReactNode } from "react";
import { NavLink } from "@/app/lib/definition";
import { auth } from "@/auth";

const links: NavLink[] = [
  {
    name: "Curriculum",
    href: "/curriculum",
    icon: "bookOpenIcon",
  },
  {
    name: "Assessments",
    href: "/curriculum/assessment",
    icon: "pencilIcon",
    options: [
      {
        name: "Assignments",
        href: "/curriculum/assessment/assignment",
      },
      {
        name: "Exams",
        href: "/curriculum/assessment/exam",
      },
    ],
  },
  {
    name: "Record",
    href: "/curriculum/record",
    icon: "chartBarIcon",
  },
];

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const userName: string = session?.user?.name as string;
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav links={links} userName={userName} />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
