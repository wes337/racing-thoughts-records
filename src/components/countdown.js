"use client";

import { useState, useEffect } from "react";

const DIGIT_CLASS =
  "text-5xl md:text-8xl font-bold text-white [text-shadow:-3px_-3px_0_#000,3px_-3px_0_#000,-3px_3px_0_#000,3px_3px_0_#000,-3px_0_0_#000,3px_0_0_#000,0_-3px_0_#000,0_3px_0_#000,-2px_-3px_0_#000,2px_-3px_0_#000,-3px_-2px_0_#000,3px_-2px_0_#000,-2px_3px_0_#000,2px_3px_0_#000,-3px_2px_0_#000,3px_2px_0_#000]";

export default function Countdown({ timestamp, onEnd }) {
  const [initialized, setInitialized] = useState(false);
  const [ended, setEnded] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!initialized || ended) {
      return;
    }

    const isOver = hours <= 0 && minutes <= 0 && seconds <= 0 && days <= 0;

    if (isOver) {
      onEnd();
      setEnded(true);
    }
  }, [initialized, days, hours, minutes, seconds, ended, onEnd]);

  useEffect(() => {
    const calculateTime = () => {
      const time = timestamp - new Date().getTime();
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));

      setHours(Math.max(hours, 0));
      setMinutes(Math.max(minutes, 0));
      setSeconds(Math.max(seconds, 0));
      setDays(Math.max(days, 0));
    };

    const interval = setInterval(calculateTime, 1000);

    calculateTime();
    setInitialized(true);

    return () => {
      clearInterval(interval);
    };
  }, [timestamp]);

  return (
    <div className="flex items-center justify-center text-center gap-2 md:gap-8">
      <div className="flex flex-col w-[84px] md:w-[128px]">
        <span className={DIGIT_CLASS}>{days}</span>
        <span className="text-md md:text-xl uppercase font-bold">Days</span>
      </div>
      <div className="flex flex-col w-[84px] md:w-[128px]">
        <span className={DIGIT_CLASS}>{hours}</span>
        <span className="text-md md:text-xl uppercase font-bold">Hours</span>
      </div>
      <div className="flex flex-col w-[84px] md:w-[128px]">
        <span className={DIGIT_CLASS}>{minutes}</span>
        <span className="text-md md:text-xl uppercase font-bold">Mins</span>
      </div>
      <div className="flex flex-col w-[84px] md:w-[128px]">
        <span className={DIGIT_CLASS}>{seconds}</span>
        <span className="text-md md:text-xl uppercase font-bold">Sec</span>
      </div>
    </div>
  );
}
