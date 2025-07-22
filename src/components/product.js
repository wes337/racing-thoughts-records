"use client";

import Image from "next/image";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Shopify from "@/shopify";
import { useCart } from "@/state";

export default function Product({ product }) {
  const [cart, setCartOpen] = useCart(
    useShallow((state) => [state.cart, state.setOpen])
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length === 1 ? product.variants[0].id : ""
  );

  const soldOut =
    product.soldOut ||
    !product.variants.some((variant) => variant.availableForSale);
  const longTitle = product.title.length > 21;

  const onAddToCart = async () => {
    if (!cart || soldOut || !selectedVariant) {
      return;
    }

    await Shopify.addToCart(cart.id, [
      { merchandiseId: selectedVariant, quantity: 1 },
    ]);

    const event = new CustomEvent("updatecart");
    document.dispatchEvent(event);

    if (product.variants.length > 1) {
      setSelectedVariant("");
    }

    setCartOpen(true);
  };

  const onBuyItNow = async () => {
    if (soldOut || !selectedVariant) {
      return;
    }

    await Shopify.buyItNow([{ merchandiseId: selectedVariant, quantity: 1 }]);
  };

  return (
    <div className="flex flex-col items-center md:flex-row lg:w-4xl xl:w-full min-h-[calc(100vh-140px)]">
      <div className="h-[40vh] md:h-auto w-full md:w-[40vw] 2xl:w-[45vw] bg-white/75 border-t-3 border-b-3 md:border-l-3 md:border-r-3 md:rounded-md border-black/50">
        <Image
          className="w-full h-full object-contain mix-blend-multiply"
          src={product.images[0]}
          width={1024}
          height={1024}
          alt=""
        />
      </div>
      <div className="flex flex-col p-4">
        <h2
          className={`font-display font-bold text-4xl xl:text-5xl ${
            longTitle
              ? "text-[2.6rem] tracking-[-4px] lg:tracking-tight xl:tracking-normal xl:text-5xl"
              : ""
          } [text-shadow:1px_0px_0px_currentColor] opacity-80`}
        >
          {product.title}
        </h2>
        <h3 className="font-sans font-bold text-2xl mt-2 opacity-80">
          {product.price}
        </h3>
        <p className="font-sans py-4 md:my-4 text-md opacity-80">
          {product.description}
        </p>
        <div className="flex items-start gap-4">
          <button
            className="cursor-pointer h-[64px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05] active:opacity-100 active:brightness-50 active:scale-[1.08]"
            onClick={onAddToCart}
          >
            <Image
              className="w-full h-full object-contain select-none"
              src={`/images/add-to-cart.png`}
              width={997}
              height={224}
              alt="Add to Cart"
            />
          </button>
          <button
            className="cursor-pointer h-[64px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05] active:opacity-100 active:brightness-50 active:scale-[1.08]"
            onClick={onBuyItNow}
          >
            <Image
              className="w-full h-full object-contain select-none"
              src={`/images/buy-now.png`}
              width={797}
              height={225}
              alt="Buy Now"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
