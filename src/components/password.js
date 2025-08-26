"use client";

import Image from "next/image";

export default function Password({ password, setPassword }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="font-display font-bold text-xl md:text-3xl uppercase opacity-90">
        Password
      </div>
      <div className="m-auto relative w-[112px] md:w-[200px]">
        <Image
          className="absolute w-full h-full pointer-events-none"
          src={`/images/box.png`}
          width={605}
          height={214}
          alt=""
        />
        <input
          className="w-full p-2 md:py-4 md:px-2.5"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
    </div>
  );
}
