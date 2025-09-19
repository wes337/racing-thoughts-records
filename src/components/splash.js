"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CDN_URL, RELEASE_DATE } from "@/utils";
import Password from "@/components/password";
import Countdown from "@/components/countdown";

export default function Splash({
  showPassword,
  showCountdown: _showCountdown,
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showCountdown, setShowCountdown] = useState(_showCountdown);

  const onEnter = () => {
    router.push(
      `/shop${
        password ? `?password=${Buffer.from(password).toString("base64")}` : ""
      }`
    );
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center h-screen m-auto gap-12"
      onClick={() => {
        if (showPassword) {
          return;
        }

        onEnter();
      }}
    >
      <div className="flex items-center justify-center">
        <div className="w-[40vw] max-w-[300px]">
          <Image
            className="w-full h-full object-contain"
            src={`${CDN_URL}/images/logo-text.png`}
            alt="Racing Thought Records."
            width={980}
            height={790}
          />
        </div>
        <div className="w-[40vw] max-w-[300px]">
          <Image
            className="w-full h-full object-contain opacity-90"
            src={`${CDN_URL}/images/logo-gray.png`}
            alt=""
            width={652}
            height={471}
          />
        </div>
      </div>
      {showCountdown && (
        <div className="mt-8 md:mt-12">
          <Countdown
            timestamp={RELEASE_DATE}
            onEnd={() => setShowCountdown(false)}
          />
        </div>
      )}
      {!showCountdown && (
        <form
          className="w-[40vw] max-w-[300px]"
          onSubmit={(event) => {
            event.preventDefault();
            onEnter();
          }}
        >
          {showPassword && (
            <Password password={password} setPassword={setPassword} />
          )}
          <button
            className="group relative cursor-pointer active:opacity-100 active:brightness-50 active:scale-[1.1]"
            type={showPassword ? "submit" : "button"}
            onClick={() => {
              if (!showPassword) {
                return;
              }

              onEnter();
            }}
          >
            <Image
              className="w-full h-full object-contain opacity-0 md:opacity-100 group-hover:opacity-0"
              src={`${CDN_URL}/images/enter.png`}
              alt="Enter"
              width={1154}
              height={386}
            />
            <Image
              className="absolute top-0 left-0 w-full h-full object-contain opacity-100 md:opacity-0 group-hover:opacity-100"
              src={`${CDN_URL}/images/enter-hover.png`}
              alt="Enter"
              width={1154}
              height={386}
            />
          </button>
        </form>
      )}
    </div>
  );
}
