"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Prevents hydration mismatch

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update interval every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return <p>Loading timer...</p>;

  const timerItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 p-4 justify-center">
      {timerItems.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center p-2 bg-gray-100 rounded-lg min-w-16"
        >
          <span className="text-2xl font-bold tabular-nums">
            {value.toString().padStart(2, "0")}
          </span>
          <span className="text-xs uppercase text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
