import SideNav from "@/app/ui/sidenav";
import { ReactNode } from "react";
import { NavLink } from "@/app/lib/definition";
import { auth } from "@/auth";

const links: NavLink[] = [
  {
    name: "Home",
    href: "/admin",
    icon: "study",
  },
  {
    name: "Curriculum",
    href: "/admin/curriculum",
    icon: "practice",
  },
  {
    name: "Exams",
    href: "/admin/exam",
    icon: "record",
  },
  {
    name: "Resources",
    href: "/admin/resource",
    icon: "record",
  },
  {
    name: "Teachers",
    href: "/admin/teacher",
    icon: "record",
  },
  {
    name: "Students",
    href: "/admin/student",
    icon: "record",
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