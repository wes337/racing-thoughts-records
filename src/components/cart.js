"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import useGlobalState from "@/global-state";

export default function Cart() {
  const [showCart, setShowCart] = useState(false);
  const [cartOpen, toggleCartOpen] = useGlobalState(
    useShallow((state) => [state.cartOpen, state.toggleCartOpen])
  );

  if (!showCart) {
    return null;
  }

  return (
    <button className="absolute right-[16px] md:right-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100">
      <Image
        className="w-auto h-full object-contain"
        src={`/images/cart-white.png`}
        alt="Cart"
        width={603}
        height={173}
      />
    </button>
  );
}
