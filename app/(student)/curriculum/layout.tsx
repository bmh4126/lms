import SideNav from "@/app/ui/sidenav";
import { ReactNode } from "react";
import {NavLink} from "@/app/lib/definition";

const links:NavLink[] = [
  {
    name: "Study",
    href: "/curriculum",
    icon: "study",
  },
  {
    name: "Practice",
    href: "/curriculum/practice",
    icon: "practice",
  },
  {
    name: "Record",
    href: "/curriculum/record",
    icon: "record",
  },
];

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              <div className="w-full flex-none md:w-64">
                <SideNav links={links} role="Student"/>
              </div>
              <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
    )
}