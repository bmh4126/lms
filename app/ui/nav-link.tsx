"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NavLink,IconsMap } from "@/app/lib/definition";

export default function NavLinks({links}:{links: NavLink[]}) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = IconsMap[link.icon];
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "text-blue-600 bg-blue-100": link.href === pathname,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
