"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NavLink, IconsMap } from "@/app/lib/definition";

export default function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [openLink, setOpenLink] = useState<string | null>(null);
  const openRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openLink) return;
    function handleClickOutside(e: MouseEvent) {
      if (openRef.current && !openRef.current.contains(e.target as Node)) {
        setOpenLink(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openLink]);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = IconsMap[link.icon];
        const isOpen = openLink === link.name;
        return (
          <div
            className="relative"
            key={link.name}
            ref={isOpen ? openRef : null}
          >
            <Link
              href={link.href}
              onClick={(e) => {
                if (link.options) {
                  e.preventDefault();
                  setOpenLink(isOpen ? null : link.name);
                }
              }}
              className={clsx(
                "shadow-md/30 flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "text-blue-600 bg-blue-100":
                    pathname === link.href ||
                    (link.options &&
                      link.options
                        .map((option) => option.href === pathname)
                        .filter((v) => v === true).length),
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>

            {link.options && isOpen ? (
              <div
                className={clsx(
                  "absolute z-10 flex flex-col gap-1 rounded-md p-2",
                  // sm screens: float below the link
                  "left-0 top-full mt-1",
                  // md+ screens: float to the right, centered on the link's center line
                  "md:left-full md:top-1/2 md:mt-0 md:-translate-y-1/2",
                )}
              >
                {link.options.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    onClick={() => setOpenLink(null)}
                    className={clsx(
                      "flex h-[40px] shadow-md/30 items-center justify-start gap-2 whitespace-nowrap rounded-md bg-gray-50 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                      {
                        "text-blue-600 bg-blue-100": option.href === pathname,
                      },
                    )}
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
