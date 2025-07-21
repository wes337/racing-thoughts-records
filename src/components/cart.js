"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import useGlobalState from "@/global-state";

export default function Cart() {
  const [showCart, cartOpen, toggleCartOpen] = useGlobalState(
    useShallow((state) => [
      state.showCart,
      state.cartOpen,
      state.toggleCartOpen,
    ])
  );

  useEffect(() => {
    if (cartOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [cartOpen]);

  if (!showCart) {
    return null;
  }

  return (
    <>
      <button
        className="absolute right-[16px] md:right-[32px] h-[32px] xl:h-[40px] w-auto cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100"
        onClick={toggleCartOpen}
      >
        <Image
          className="hidden xl:block w-auto h-full object-contain"
          src={`/images/cart-white.png`}
          alt="Cart"
          width={603}
          height={173}
        />
        <Image
          className="xl:hidden w-auto h-full object-contain ml-auto"
          src={`/images/cart-icon.png`}
          alt="Cart"
          width={603}
          height={173}
        />
      </button>
      {cartOpen &&
        createPortal(
          <div className="fixed top-0 right-0 flex w-full h-full z-5">
            <div
              className="hidden lg:block w-full h-full bg-black/75"
              onClick={toggleCartOpen}
            />
            <div
              id="cart"
              className="bg-white w-full h-full lg:w-[33vw] lg:border-l-6 border-black/85"
            >
              <button
                className="absolute top-[12px] left-[16px] h-[32px] lg:left-[auto] lg:right-[16px] z-1 opacity-85 cursor-pointer hover:scale-[1.1] hover:opacity-100"
                onClick={toggleCartOpen}
              >
                <Image
                  className="w-auto h-full object-contain"
                  src={"/images/close.png"}
                  alt="Close"
                  width={138}
                  height={112}
                />
              </button>
              <div className="w-full h-[32px] mt-2.5">
                <Image
                  className="w-auto h-full object-contain m-auto"
                  src={"/images/cart.png"}
                  width={603}
                  height={173}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
