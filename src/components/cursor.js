"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { eventTargetInsideElementTag } from "@/utils";

export default function Cursor() {
  const [hide, setHide] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {
    const onMouseMove = (event) => {
      setPositionX(event.clientX);
      setPositionY(event.clientY);

      const hide = eventTargetInsideElementTag(event);
      setHide(hide);
    };

    document.addEventListener("pointermove", onMouseMove);

    return () => [document.removeEventListener("pointermove", onMouseMove)];
  }, []);

  return (
    <>
      <Image
        className="hidden md:block fixed w-[20px] h-[27px] pointer-events-none z-25 drop-shadow-lg"
        src={`/images/cursor.png`}
        alt=""
        width={109}
        height={149}
        style={{
          opacity: hide ? 0 : 1,
          left: `${positionX}px`,
          top: `${positionY}px`,
        }}
      />
    </>
  );
}
