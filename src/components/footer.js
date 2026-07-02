"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CDN_URL } from "@/utils";

const LINKS = [
  { label: "Privacy", href: "/policies/privacy-policy" },
  { label: "Refunds", href: "/policies/refund-policy" },
  { label: "Terms", href: "/policies/terms-of-service" },
  { label: "Shipping", href: "/policies/shipping-policy" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ hideLinks, theme }) {
  const isGodhandUSA = theme === "godhandusa";
  const pathname = usePathname();
  const [fixed, setFixed] = useState(null);

  useEffect(() => {
    const onResize = () => {
      const noScroll = !(
        document.documentElement.scrollHeight > window.innerHeight ||
        document.body.scrollHeight > window.innerHeight
      );

      setFixed(noScroll || pathname === "/");
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const positionClasses = isGodhandUSA
    ? "relative z-10 mt-4"
    : `z-1 ${fixed === null ? "opacity-0" : ""} ${
        fixed ? "fixed bottom-0 left-0" : "mt-auto"
      }`;

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-[64px] ${positionClasses}`}
    >
      {!hideLinks && (
        <div
          className={`flex gap-6 lg:gap-8 font-sans font-medium text-xs md:text-sm tracking-tighter mb-2 ${
            isGodhandUSA ? "text-green-800" : ""
          }`}
        >
          {LINKS.map(({ label, href }) => {
            return (
              <Link
                key={label}
                className="opacity-75 hover:opacity-100"
                href={href}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
      <div className="h-[16px] md:h-[24px]">
        <Image
          className={`w-full h-full object-contain select-none ${
            isGodhandUSA ? "" : ""
          }`}
          src={`${CDN_URL}/images/copy.png`}
          alt="Copyright Racing Thought Records."
          width={1450}
          height={72}
        />
      </div>
    </div>
  );
}
