import { ReactNode } from "react";
import SideNav from "@/app/ui/sidenav";
import { NavLink } from "@/app/lib/definition";

const links: NavLink[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    name: "Analysis",
    href: "/dashboard/analysis",
    icon: "analysis",
  },
  {
    name: "Report",
    href: "/dashboard/report",
    icon: "report",
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav links={links} role="Teacher"/>
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
