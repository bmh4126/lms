"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NavLink, IconsMap } from "@/app/lib/definition";

// How strongly a link matches the current path: the length of the longest href
// — its own or any of its options' — that is a prefix of the pathname. -1 means
// no match. A longer prefix is a more specific match.
function matchLength(link: NavLink, pathname: string): number {
  const hrefs = [link.href, ...(link.options?.map((o) => o.href) ?? [])];
  return hrefs
    .filter((h) => pathname.startsWith(h))
    .reduce((max, h) => Math.max(max, h.length), -1);
}

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

  // The active top-level link is the one whose best matching href (its own or
  // one of its options') is the longest prefix of the current pathname.
  // Identify the active link by name, not href: dropdown parents share the
  // placeholder href "#", so href can't distinguish them.
  const activeName = links
    .map((link) => ({ name: link.name, len: matchLength(link, pathname) }))
    .filter((l) => l.len >= 0)
    .sort((a, b) => b.len - a.len)[0]?.name;

  // The active option is the single option href — across all links — that is the
  // longest prefix of the current pathname, so a deep path keeps its option lit.
  const activeOptionHref = links
    .flatMap((link) => link.options ?? [])
    .map((o) => o.href)
    .filter((h) => pathname.startsWith(h))
    .sort((a, b) => b.length - a.length)[0];

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
                  "text-blue-600 bg-blue-100": link.name === activeName,
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
                        "text-blue-600 bg-blue-100":
                          option.href === activeOptionHref,
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
