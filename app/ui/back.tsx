"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./font";

// A real "go back" button: it walks the browser history. `href` is an optional
// fallback used only when there's no in-app history to return to (e.g. the page
// was opened directly from a shared link or a new tab).
export default function Back({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) router.back();
          else if (href) router.push(href);
        }}
        className="shadow-lg/30 hover:shadow-blue-900 flex w-fit cursor-pointer flex-row rounded-xl bg-blue-400 p-2 pl-4 pr-4 text-white hover:text-blue-50 hover:opacity-80"
      >
        <ArrowLeftIcon className="w-4 mr-1" />
        <p className={`${lusitana.className} font-xl ml-1`}>Back</p>
      </button>
    </div>
  );
}

export function Cancel({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) router.back();
          else if (href) router.push(href);
        }}
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
      >
        <p className={`${lusitana.className} font-xl ml-1`}>Cancel</p>
      </button>
    </div>
  );
}
