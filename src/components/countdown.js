"use client";

import { useState, useEffect } from "react";

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
    <div className="flex items-center justify-center text-center gap-6 md:gap-8">
      <div className="flex flex-col w-[64px] md:w-[80px]">
        <span className="text-3xl font-bold">{days}</span>
        <span className="text-md md:text-xl uppercase">Days</span>
      </div>
      <div className="flex flex-col w-[64px] md:w-[80px]">
        <span className="text-3xl font-bold">{hours}</span>
        <span className="text-md md:text-xl uppercase">Hours</span>
      </div>
      <div className="flex flex-col w-[64px] md:w-[80px]">
        <span className="text-3xl font-bold">{minutes}</span>
        <span className="text-md md:text-xl uppercase">Mins</span>
      </div>
      <div className="flex flex-col w-[64px] md:w-[80px]">
        <span className="text-3xl font-bold">{seconds}</span>
        <span className="text-md md:text-xl uppercase">Sec</span>
      </div>
    </div>
  );
}
