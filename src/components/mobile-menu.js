"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { usePathname, useRouter } from "next/navigation";
import { useLayout } from "@/state";
import { CDN_URL } from "@/utils";

export default function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, toggleMobileMenuOpen] = useLayout(
    useShallow((state) => [state.mobileMenuOpen, state.toggleMobileMenuOpen])
  );

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [mobileMenuOpen]);

  const showBackButton = pathname.match("/products/");

  return (
    <>
      {showBackButton ? (
        <button
          className="md:hidden absolute left-[16px] md:left-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 z-1 active:scale-[1.2]"
          onClick={() => router.back()}
        >
          <Image
            className="w-auto h-full object-contain"
            src={`${CDN_URL}/images/back.png`}
            alt="Back"
            width={250}
            height={209}
          />
        </button>
      ) : (
        <button
          className="md:hidden absolute left-[16px] md:left-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 z-1 active:scale-[1.2]"
          onClick={toggleMobileMenuOpen}
        >
          <Image
            className="w-auto h-full object-contain"
            src={
              mobileMenuOpen
                ? `${CDN_URL}/images/close.png`
                : `${CDN_URL}/images/menu.png`
            }
            alt="Menu"
            width={138}
            height={112}
          />
        </button>
      )}
      {mobileMenuOpen &&
        createPortal(
          <div className="mobile-menu-bg md:hidden fixed top-0 left-0 w-full h-full bg-white z-5">
            <button
              className="absolute top-[12px] left-[16px] h-[32px] z-1 opacity-85 active:scale-[1.2]"
              onClick={toggleMobileMenuOpen}
            >
              <Image
                className="w-auto h-full object-contain"
                src={
                  mobileMenuOpen
                    ? `${CDN_URL}/images/close.png`
                    : `${CDN_URL}/images/menu.png`
                }
                alt="Menu"
                width={138}
                height={112}
              />
            </button>
            <div className="ml-[56px] flex p-4 opacity-85">
              <Image
                className="h-[24px] w-auto object-contain"
                src={`${CDN_URL}/images/logo-text-horizontal.png`}
                alt="Racing Thoughts Records."
                width={2085}
                height={136}
              />
            </div>
            <div className="flex flex-col gap-10 p-8">
              <Link
                className="flex h-[28px] w-full gap-4"
                href={`/collections/cds`}
                prefetch
              >
                <Image
                  className="w-[28px] h-auto object-contain opacity-80"
                  src={`${CDN_URL}/images/arrow-right.png`}
                  alt=""
                  width={300}
                  height={122}
                />
                <Image
                  className="w-auto h-full object-contain"
                  src={`${CDN_URL}/images/cds.png`}
                  alt="CDs"
                  width={628}
                  height={212}
                />
              </Link>
              <Link
                className="flex h-[28px] w-full gap-4"
                href={`/collections/vinyl`}
                prefetch
              >
                <Image
                  className="w-[28px] h-auto object-contain opacity-80"
                  src={`${CDN_URL}/images/arrow-right.png`}
                  alt=""
                  width={300}
                  height={122}
                />
                <Image
                  className="w-auto h-full object-contain"
                  src={`${CDN_URL}/images/vinyl.png`}
                  alt="Vinyl"
                  width={816}
                  height={207}
                />
              </Link>
              <Link
                className="flex h-[28px] w-full gap-4"
                href={`/collections/cassettes`}
                prefetch
              >
                <Image
                  className="w-[28px] h-auto object-contain opacity-80"
                  src={`${CDN_URL}/images/arrow-right.png`}
                  alt=""
                  width={300}
                  height={122}
                />
                <Image
                  className="w-auto h-full object-contain"
                  src={`${CDN_URL}/images/cassettes.png`}
                  alt="Cassettes"
                  width={1223}
                  height={187}
                />
              </Link>
              <Link
                className="flex h-[28px] w-full gap-4"
                href={`/collections/other`}
                prefetch
              >
                <Image
                  className="w-[28px] h-auto object-contain opacity-80"
                  src={`${CDN_URL}/images/arrow-right.png`}
                  alt=""
                  width={300}
                  height={122}
                />
                <Image
                  className="w-auto h-full object-contain"
                  src={`${CDN_URL}/images/other.png`}
                  alt="Other"
                  width={1170}
                  height={235}
                />
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
