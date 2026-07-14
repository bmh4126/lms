import { ReactNode } from "react";
import SideNav from "@/app/ui/sidenav";
import { NavLink } from "@/app/lib/definition";
import { auth } from "@/auth";

const links: NavLink[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "homeIcon",
  },
  {
    name: "Analysis",
    href: "/dashboard/analysis",
    icon: "chartBarIcon",
  },
  {
    name: "Report",
    href: "/dashboard/report",
    icon: "newspaperIcon",
  },
];

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const userName = session?.user.name as string;
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav links={links} userName={userName} />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
