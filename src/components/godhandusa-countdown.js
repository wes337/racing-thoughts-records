"use client";

import { useState } from "react";
import Countdown from "@/components/countdown";

export default function GodhandUSACountdown({ timestamp }) {
  const [ended, setEnded] = useState(false);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8 mt-auto font-mono">
      {ended ? (
        <button
          className="cursor-pointer font-mono text-3xl uppercase tracking-widest md:text-5xl opacity-90 hover:opacity-100 hover:scale-[1.1] active:scale-[1.2]"
          type="button"
          onClick={() => window.location.reload()}
        >
          Let&apos;s Go
        </button>
      ) : (
        <Countdown timestamp={timestamp} onEnd={() => setEnded(true)} />
      )}
    </div>
  );
}
