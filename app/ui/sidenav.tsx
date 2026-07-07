import Link from "next/link";
import NavLinks from "./nav-link";
import Logo from "./logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { NavLink } from "@/app/lib/definition";
import { signOut } from "@/auth";

export default function SideNav({links,userName}: {links:NavLink[],userName:string}) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="border-r-2 border-b-2 mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 hover:bg-blue-400 group p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Logo userName={userName} />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks links={links} />
        <div className="border-r-2 border-b-2 hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="border-r-2 border-b-2 flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
