import SideNav from "@/app/ui/sidenav";
import { ReactNode } from "react";
import { NavLink } from "@/app/lib/definition";
import { auth } from "@/auth";

const links: NavLink[] = [
  {
    name: "Home",
    href: "/admin",
    icon: "homeIcon",
  },
  {
    name: "Study Materials",
    href: "#",
    icon: "bookOpenIcon",
    options: [
      {
        name: "Curriculum",
        href: "/admin/curriculum",
      },
      {
        name: "Videos",
        href: "/admin/video",
      },
      {
        name: "Resources",
        href: "/admin/resource",
      },
    ],
  },
  {
    name: "Assessments",
    href: "/admin/assessment",
    icon: "bookOpenIcon",
  },
  {
    name: "Users",
    href: "#",
    icon: "userIcon",
    options: [
      {
        name: "Teachers",
        href: "/admin/teacher",
      },
      {
        name: "Students",
        href: "/admin/student",
      },
      {
        name: "Classes",
        href: "/admin/class"
      },
    ],
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
