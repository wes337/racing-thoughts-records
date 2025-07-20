"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRandomNumberBetween } from "@/utils";

export default function TopBar({ hideMenu }) {
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [eye, setEye] = useState("open");

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [menuOpen]);

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
    <>
      <div className="sticky top-0 left-0 flex items-center w-full h-[64px] md:h-[72px] 2xl:h-[96px] z-2">
        {!hideMenu && (
          <>
            <div className="top-bar-bg w-full h-full bg-white" />
            <button
              className="md:hidden absolute left-[16px] md:left-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 z-1"
              onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
            >
              <Image
                className="w-auto h-full object-contain"
                src={menuOpen ? "/images/close.png" : `/images/menu.png`}
                alt="Menu"
                width={138}
                height={112}
              />
            </button>
          </>
        )}
        <div className="flex items-center justify-center gap-8 absolute left-[50%] translate-x-[-50%] h-[40px] md:h-[48px] w-full">
          {!hideMenu && (
            <div className="hidden md:flex h-full w-[33%] justify-end gap-8">
              <Link
                className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
                href="/collections/1"
              >
                <Image
                  className="w-auto h-full object-contain"
                  src={`/images/cds.png`}
                  alt="CDs"
                  width={628}
                  height={212}
                />
              </Link>
              <Link
                className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
                href="/collections/2"
              >
                <Image
                  className="w-auto h-full object-contain"
                  src={`/images/vinyl.png`}
                  alt="Vinyl"
                  width={816}
                  height={207}
                />
              </Link>
            </div>
          )}
          <Link
            className="relative h-full flex items-center justify-center w-auto opacity-90 hover:scale-[1.1] hover:opacity-100"
            href="/"
          >
            <Image
              className={`w-auto h-full object-contain ${
                eye === "open" ? "opacity-100" : "opacity-0"
              }`}
              src={`/images/eye-open.png`}
              alt="Racing Thought Records"
              width={357}
              height={249}
            />
            <Image
              className={`absolute top-0 w-auto h-full object-contain ${
                eye === "close" ? "opacity-100" : "opacity-0"
              }`}
              src={`/images/eye-close.png`}
              alt=""
              width={357}
              height={249}
            />
            <Image
              className={`absolute top-0 w-auto h-full object-contain ${
                eye === "left" ? "opacity-100" : "opacity-0"
              }`}
              src={`/images/eye-left.png`}
              alt=""
              width={357}
              height={249}
            />
            <Image
              className={`absolute top-0 w-auto h-full object-contain ${
                eye === "right" ? "opacity-100" : "opacity-0"
              }`}
              src={`/images/eye-right.png`}
              alt=""
              width={357}
              height={249}
            />
          </Link>
          {!hideMenu && (
            <div className="hidden md:flex h-full w-[33%] justify-start gap-8">
              <Link
                className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
                href="/collections/3"
              >
                <Image
                  className="w-auto h-full object-contain"
                  src={`/images/cassettes.png`}
                  alt="Cassettes"
                  width={1223}
                  height={187}
                />
              </Link>
              <Link
                className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
                href="/collections/4"
              >
                <Image
                  className="w-auto h-full object-contain"
                  src={`/images/other.png`}
                  alt="Other"
                  width={1170}
                  height={235}
                />
              </Link>
            </div>
          )}
        </div>
        {!hideMenu && showCart && (
          <button className="absolute right-[16px] md:right-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100">
            <Image
              className="w-auto h-full object-contain"
              src={`/images/cart-white.png`}
              alt="Cart"
              width={603}
              height={173}
            />
          </button>
        )}
      </div>
      {menuOpen && (
        <div className="mobile-menu-bg md:hidden fixed top-0 left-0 w-full h-full bg-white z-5">
          <button
            className="absolute top-[12px] left-[16px] h-[32px] z-1 opacity-85"
            onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
          >
            <Image
              className="w-auto h-full object-contain"
              src={menuOpen ? "/images/close.png" : `/images/menu.png`}
              alt="Menu"
              width={138}
              height={112}
            />
          </button>
          <div className="ml-[56px] flex p-4 opacity-85">
            <Image
              className="h-[24px] w-auto object-contain"
              src={`/images/logo-text-horizontal.png`}
              alt="Racing Thoughts Records."
              width={2085}
              height={136}
            />
          </div>
          <div className="flex flex-col gap-10 p-8">
            <Link className="flex h-[28px] w-full gap-4" href="/collections/1">
              <Image
                className="w-[28px] h-auto object-contain opacity-80"
                src={`/images/arrow-right.png`}
                alt=""
                width={300}
                height={122}
              />
              <Image
                className="w-auto h-full object-contain"
                src={`/images/cds.png`}
                alt="CDs"
                width={628}
                height={212}
              />
            </Link>
            <Link className="flex h-[28px] w-full gap-4" href="/collections/2">
              <Image
                className="w-[28px] h-auto object-contain opacity-80"
                src={`/images/arrow-right.png`}
                alt=""
                width={300}
                height={122}
              />
              <Image
                className="w-auto h-full object-contain"
                src={`/images/vinyl.png`}
                alt="Vinyl"
                width={816}
                height={207}
              />
            </Link>
            <Link className="flex h-[28px] w-full gap-4" href="/collections/3">
              <Image
                className="w-[28px] h-auto object-contain opacity-80"
                src={`/images/arrow-right.png`}
                alt=""
                width={300}
                height={122}
              />
              <Image
                className="w-auto h-full object-contain"
                src={`/images/cassettes.png`}
                alt="Cassettes"
                width={1223}
                height={187}
              />
            </Link>
            <Link className="flex h-[28px] w-full gap-4" href="/collections/4">
              <Image
                className="w-[28px] h-auto object-contain opacity-80"
                src={`/images/arrow-right.png`}
                alt=""
                width={300}
                height={122}
              />
              <Image
                className="w-auto h-full object-contain"
                src={`/images/other.png`}
                alt="Other"
                width={1170}
                height={235}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
