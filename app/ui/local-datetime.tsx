"use client";

import { useEffect, useState } from "react";
import { formatDateToTime } from "@/app/lib/utils";

// Renders a timestamp in the *viewer's* local timezone.
//
// Intl uses the runtime's default timezone, which on the server (UTC on Vercel)
// differs from the user's browser. Formatting during SSR would therefore both
// show the wrong zone and cause a hydration mismatch. Instead we render "" on
// the server and on the first client render (they match — no mismatch), then
// fill in the browser-local value in an effect after mount.
export function LocalDateTime({ date }: { date: Date }) {
  const [text, setText] = useState("");
  const time = date.getTime(); // stable dep: same instant won't re-run the effect

  useEffect(() => {
    setText(formatDateToTime(new Date(time)));
  }, [time]);

  return <>{text}</>;
}
