"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CDN_URL } from "@/utils";
import Eye from "@/components/eye";
import MobileMenu from "@/components/mobile-menu";
import Cart from "@/components/cart";

export default function TopBar({ hideMenu, hideBackground }) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = Math.floor(window.scrollY);
      setScroll(scrollY);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hideMenu) {
    return (
      <div className="sticky top-0 left-0 flex justify-center items-center w-full h-[64px] md:h-[72px] 2xl:h-[96px] z-2">
        <div className="h-[40px] md:h-[48px]">
          <Eye />
        </div>
      </div>
    );
  }

  const opacity = () =>
    scroll >= 64 ? "opacity-50 md:opacity-0" : "opacity-0";

  return (
    <div className="sticky top-0 left-0 flex items-center w-full h-[64px] md:h-[72px] 2xl:h-[96px] z-4">
      <div
        className={`${
          hideBackground ? `${opacity()}` : "top-bar-bg"
        } w-full h-full bg-white`}
      />
      <MobileMenu />
      <div className="flex items-center justify-center gap-4 xl:gap-8 absolute left-[50%] translate-x-[-50%] h-[40px] md:h-[48px] w-full">
        <div className="hidden md:flex h-full w-[33%] justify-end gap-4 xl:gap-8">
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75 active:opacity-100 active:scale-[1.2]"
            href={`/collections/cds`}
            prefetch
          >
            <Image
              className="w-auto h-full object-contain"
              src={`${CDN_URL}/images/cds.png`}
              alt="CDs"
              width={628}
              height={212}
            />
          </Link>
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75 active:scale-[1.2]"
            href={`/collections/vinyl`}
            prefetch
          >
            <Image
              className="w-auto h-full object-contain"
              src={`${CDN_URL}/images/vinyl.png`}
              alt="Vinyl"
              width={816}
              height={207}
            />
          </Link>
        </div>
        <Eye />
        <div className="hidden md:flex h-full w-[33%] justify-start gap-4 xl:gap-8">
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75 active:scale-[1.2]"
            href={`/collections/cassettes`}
            prefetch
          >
            <Image
              className="w-auto h-full object-contain"
              src={`${CDN_URL}/images/cassettes.png`}
              alt="Cassettes"
              width={1223}
              height={187}
            />
          </Link>
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75 active:scale-[1.2]"
            href={"https://www.smalldarkone.com"}
            target="_blank"
          >
            <Image
              className="w-auto h-full object-contain"
              src={`${CDN_URL}/images/merch.png`}
              alt="Merch"
              width={1170}
              height={235}
            />
          </Link>
        </div>
      </div>
      <Cart />
    </div>
  );
}
