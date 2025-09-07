"use client";

import { useState } from "react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import Shopify from "@/shopify";
import { useCart } from "@/state";
import { CDN_URL } from "@/utils";

export default function Product({ product }) {
  const [cart, setCartOpen] = useCart(
    useShallow((state) => [state.cart, state.setOpen])
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length === 1 ? product.variants[0].id : ""
  );
  const [imageIndex, setImageIndex] = useState(0);

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

  const gotoNextImage = () => {
    setImageIndex((index) => {
      const nextIndex = index + 1;

      if (nextIndex > product.images.length - 1) {
        return 0;
      }

      return nextIndex;
    });
  };

  const gotoPreviousImage = () => {
    setImageIndex((index) => {
      const previousIndex = index - 1;

      if (previousIndex < 0) {
        return product.images.length - 1;
      }

      return previousIndex;
    });
  };

  return (
    <div className="flex flex-col items-center md:flex-row lg:w-4xl xl:w-full min-h-[calc(100vh-140px)] md:max-w-[75vw] md:mx-auto">
      <div className="w-full h-full">
        <div className="relative h-[40vh] md:h-[70vh] rounded-xl w-full md:w-[40vw] 2xl:w-[40vw] overflow-hidden bg-gray-300/10">
          <Image
            className="absolute top-0 left-0 w-full h-full z-2"
            src={`/images/box-large.png`}
            width={1011}
            height={982}
            alt=""
          />
          <div className="relative w-[calc(100%-8px)] h-[calc(100%-8px)] md:w-[calc(100%-16px)] md:h-[calc(100%-16px)] bg-gray-500/10 m-1 md:m-2 rounded-lg overflow-hidden">
            {product.images.map((image, index) => {
              return (
                <Image
                  key={`main-${image}`}
                  className={`absolute w-full h-full object-contain z-1 ${
                    index === imageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  src={image}
                  width={1024}
                  height={1024}
                  alt=""
                />
              );
            })}
          </div>
          {product.images.length > 1 && (
            <>
              <button
                className="absolute top-0 left-0 z-10 h-full w-[20%] flex md:hidden items-center justify-center cursor-pointer"
                onClick={gotoPreviousImage}
              >
                <Image
                  className="w-[48px] h-auto object-contain scale-x-[-1]"
                  src={`${CDN_URL}/images/arrow-right.png`}
                  alt=""
                  width={300}
                  height={122}
                />
              </button>
              <button
                className="absolute top-0 right-0 z-10 h-full w-[20%] flex md:hidden items-center justify-center cursor-pointer"
                onClick={gotoNextImage}
              >
                <Image
                  className="w-[48px] h-auto object-contain"
                  src={`${CDN_URL}/images/arrow-right.png`}
                  alt=""
                  width={300}
                  height={122}
                />
              </button>
            </>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="hidden md:flex justify-evenly w-full h-[80px] z-5">
            {product.images.map((image, index) => {
              return (
                <button
                  key={`select-${image}`}
                  className="relative flex w-auto h-full cursor-pointer"
                  onClick={() => setImageIndex(index)}
                >
                  <Image
                    className={`w-full m-auto h-full object-contain rounded-md`}
                    src={image}
                    width={1024}
                    height={1024}
                    alt=""
                  />
                  <Image
                    className={`absolute top-0 left-0 w-full h-full z-2 pointer-events-none ${
                      index === imageIndex ? "opacity-100" : "opacity-50"
                    }`}
                    src={`/images/box-large.png`}
                    width={1011}
                    height={982}
                    alt=""
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-col p-4">
        <h2
          className={`font-mono font-bold leading-8 text-[2rem] xl:text-4xl xl:leading-10 ${
            longTitle
              ? "text-[2rem] tracking-[-2px] lg:tracking-tight xl:tracking-tight xl:text-4xl"
              : ""
          } opacity-90`}
        >
          {product.title}
        </h2>
        <h3 className="font-sans font-medium text-2xl mt-2 opacity-80">
          {product.price}
        </h3>
        <p className="font-sans font-light py-4 text-sm md:my-4 md:text-md opacity-80">
          {product.description}
        </p>
        <div className="flex items-start gap-4">
          <button
            className="cursor-pointer h-[64px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05] active:opacity-100 active:brightness-50 active:scale-[1.08]"
            onClick={onAddToCart}
          >
            <Image
              className="w-full h-full object-contain select-none"
              src={`${CDN_URL}/images/add-to-cart.png`}
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
              src={`${CDN_URL}/images/buy-now.png`}
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
