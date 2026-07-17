"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/app/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const param = new URLSearchParams(searchParams);
    param.set("page", pageNumber.toString());
    return `${pathname}?${param.toString()}`;
  };

  return (
    <>
      {/*  NOTE: Uncomment this code in Chapter 10 */}

      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            const isMiddle = page === "...";
            // Any border facing a "..." is a stray line (both the neighbor's
            // edge and the "..." edge stack on the same pixel via -space-x-px),
            // so drop it. Outer ends stay rounded.
            const leftOpen = allPages[index - 1] === "...";
            const rightOpen = allPages[index + 1] === "...";

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                isMiddle={isMiddle}
                isFirst={index === 0}
                isLast={index === allPages.length - 1}
                leftOpen={leftOpen}
                rightOpen={rightOpen}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  isMiddle,
  isFirst,
  isLast,
  leftOpen,
  rightOpen,
}: {
  page: number | string;
  href: string;
  isMiddle?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  leftOpen?: boolean;
  rightOpen?: boolean;
  isActive: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border shadow-md/30",
    {
      "rounded-l-md": isFirst,
      "rounded-r-md": isLast,
      "z-10 bg-blue-600 border-blue-600 text-white shadow-none": isActive,
      "hover:bg-gray-100": !isActive && !isMiddle,
      "border-transparent text-gray-300 shadow-none": isMiddle,
      // Drop whichever border faces a "..." — the neighbor edge and the "..."
      // edge stack on the same pixel, so removing one side clears the line.
      "border-l-transparent": leftOpen,
      "border-r-transparent": rightOpen,
    },
  );

  return isActive || isMiddle ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border shadow-md/30",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    },
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
