"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CDN_URL, getRandomNumberBetween } from "@/utils";

export default function Eye() {
  const pathname = usePathname();
  const [eye, setEye] = useState("open");

  useEffect(() => {
    let timeout;

    const animateEye = (direction) => {
      setEye(direction);
      timeout = setTimeout(
        () => {
          setEye("open");
        },
        direction === "close" ? 500 : 1000
      );
    };

    const interval = setInterval(() => {
      const random = getRandomNumberBetween(1, 4);

      if (random === 1 || random === 4) {
        animateEye("close");
      } else if (random === 2) {
        animateEye("left");
      } else if (random === 3) {
        animateEye("right");
      }
    }, 5000);

    return () => {
      clearInterval(interval);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <Link
      className="relative h-full flex items-center justify-center w-auto opacity-90 hover:scale-[1.1] hover:opacity-100 active:opacity-100 active:scale-[1.2]"
      href={pathname.match("/shop") ? "/" : "/shop"}
    >
      <Image
        className={`w-auto h-full object-contain ${
          eye === "open" ? "opacity-100" : "opacity-0"
        }`}
        src={`${CDN_URL}/images/eye-open.png`}
        alt="Racing Thought Records"
        width={357}
        height={249}
      />
      <Image
        className={`absolute top-0 w-auto h-full object-contain ${
          eye === "close" ? "opacity-100" : "opacity-0"
        }`}
        src={`${CDN_URL}/images/eye-close.png`}
        alt=""
        width={357}
        height={249}
      />
      <Image
        className={`absolute top-0 w-auto h-full object-contain ${
          eye === "left" ? "opacity-100" : "opacity-0"
        }`}
        src={`${CDN_URL}/images/eye-left.png`}
        alt=""
        width={357}
        height={249}
      />
      <Image
        className={`absolute top-0 w-auto h-full object-contain ${
          eye === "right" ? "opacity-100" : "opacity-0"
        }`}
        src={`${CDN_URL}/images/eye-right.png`}
        alt=""
        width={357}
        height={249}
      />
    </Link>
  );
}
