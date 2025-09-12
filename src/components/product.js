"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import Shopify from "@/shopify";
import { useCart } from "@/state";
import { CDN_URL } from "@/utils";

export default function Product({ product }) {
  const [cart, setCartOpen] = useCart(
    useShallow((state) => [state.cart, state.setOpen])
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length === 1 ? product.variants[0].id : ""
  );
  const [imageIndex, setImageIndex] = useState(0);

  const soldOut =
    product.soldOut ||
    !product.variants.some((variant) => variant.availableForSale);
  const longTitle = product.title.length > 21;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const onAddToCart = async () => {
    if (!cart || soldOut || !selectedVariant || quantity <= 0) {
      return;
    }

    await Shopify.addToCart(cart.id, [
      { merchandiseId: selectedVariant, quantity },
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

  const customBackground = () => {
    return [
      "lil-darkie-collectors-edition-1",
      "this-does-not-exist",
      "lil-darkie-the-future-is-dark",
      "lil-darkie-swamp",
      "lil-darkie-swamp-drained",
    ].includes(product.handle);
  };

  return (
    <>
      {customBackground() && (
        <div className="fixed top-0 left-0 w-full h-full z-0 mix-blend-overlay">
          <Image
            className="w-full h-full object-cover"
            src={`/images/custom-bg/${product.handle}.png`}
            width={2351}
            height={1080}
            alt=""
          />
        </div>
      )}
      <div className="flex flex-col items-center md:flex-row lg:w-4xl xl:w-full min-h-[calc(100vh-140px)] md:max-w-[90vw] md:mx-auto">
        <MobilePhotos
          product={product}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          gotoNextImage={gotoNextImage}
          gotoPreviousImage={gotoPreviousImage}
        />
        <DesktopPhotos
          product={product}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
        />
        <div className="flex flex-col p-4 md:w-full">
          <h2
            className={`font-mono font-bold leading-8 text-[2rem] xl:text-4xl xl:leading-10 ${
              longTitle
                ? "text-[2rem] tracking-[-2px] lg:tracking-tight xl:tracking-tight xl:text-4xl"
                : ""
            } opacity-90`}
          >
            {product.title}
          </h2>
          <h3 className="font-sans font-medium text-2xl min-[1921px]:text-3xl mt-2 opacity-80">
            {product.price}
          </h3>
          <p className="font-sans font-light py-4 text-sm min-[1921px]:text-lg md:my-4 md:text-md opacity-80">
            {product.description}
          </p>
          <div className="flex items-start gap-4 min-[1921px]:min-w-[608px] mr-auto">
            <button
              className="cursor-pointer h-[64px] min-[1921px]:h-[80px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05] active:opacity-100 active:brightness-50 active:scale-[1.08]"
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
              className="cursor-pointer h-[64px] min-[1921px]:h-[80px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05] active:opacity-100 active:brightness-50 active:scale-[1.08]"
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
    </>
  );
}

function MobilePhotos({
  product,
  imageIndex,
  gotoNextImage,
  gotoPreviousImage,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (event) => {
    try {
      setTouchEnd(null);
      setTouchStart(event.targetTouches[0].clientX);
    } catch {
      // Do nothing
    }
  };

  const onTouchMove = (event) => {
    try {
      setTouchEnd(event.targetTouches[0].clientX);
    } catch {
      // Do nothing
    }
  };

  const onTouchEnd = () => {
    try {
      if (!touchStart || !touchEnd) {
        return;
      }

      const minSwipeDistance = 50;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isRightSwipe) {
        gotoPreviousImage();
      } else if (isLeftSwipe) {
        gotoNextImage();
      }
    } catch {
      // Do nothing
    }
  };

  return (
    <div
      className="block md:hidden w-[calc(100%-24px)] h-full my-2"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full bg-gray-300/10">
        <Image
          className="absolute top-0 left-0 w-full h-full z-2"
          src={`/images/box-large.png`}
          width={1011}
          height={982}
          alt=""
        />
        <Image
          className="w-full h-auto z-[-1] opacity-0"
          src={product.images[0]}
          width={1024}
          height={1024}
          alt=""
        />
        {product.images.map((image, index) => {
          return (
            <div
              key={`main-${image}`}
              className="absolute top-0 left-0 w-[calc(100%-10px)] h-[calc(100%-10px)] bg-gray-500/10 m-1 rounded-lg overflow-hidden z-1"
            >
              <Image
                className={`w-full h-full object-contain z-1 ${
                  index === imageIndex ? "opacity-100" : "opacity-0"
                }`}
                src={image}
                width={1024}
                height={1024}
                alt=""
              />
            </div>
          );
        })}
        {product.images.length > 1 && (
          <>
            <button
              className="absolute top-0 left-0 z-3 h-full w-[50%] flex items-center justify-center cursor-pointer"
              onClick={gotoPreviousImage}
            />
            <button
              className="absolute top-0 right-0 z-3 h-full w-[50%] flex items-center justify-center cursor-pointer"
              onClick={gotoNextImage}
            />
          </>
        )}
        <div className="absolute bottom-[-8px] left-[50%] translate-x-[-50%] flex items-center justify-center w-full z-2 text-center tracking-[-2px]">
          <div className="flex items-center justify-center w-[64px] text-center bg-black text-white text-sm px-2 py-1 rounded-xl">
            {imageIndex + 1} / {product.images.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopPhotos({ product, imageIndex, setImageIndex }) {
  return (
    <div className="hidden md:block flex flex-col items-center justify-center w-full h-full">
      <div className="relative h-[33vw] rounded-xl w-[33vw] overflow-hidden bg-gray-300/10 m-auto">
        <div className="absolute bottom-[16px] left-0 w-full z-2 text-center tracking-[-2px] md:hidden">
          {imageIndex + 1} / {product.images.length}
        </div>
        <Image
          className="absolute top-0 left-0 w-full h-full z-2"
          src={`/images/box-large.png`}
          width={1011}
          height={982}
          alt=""
        />
        <div className="relative w-[calc(100%-16px)] h-[calc(100%-16px)] bg-gray-500/10 m-2 rounded-lg overflow-hidden">
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
      </div>
      {product.images.length > 1 && (
        <div className="flex justify-evenly w-full h-[8vh] z-5">
          {product.images.map((image, index) => {
            return (
              <button
                key={`select-${image}`}
                className="relative flex w-auto h-full m-auto cursor-pointer"
                onClick={() => setImageIndex(index)}
              >
                <Image
                  className={`w-auto h-full object-contain m-auto rounded-md`}
                  src={image}
                  width={1024}
                  height={1024}
                  alt=""
                />
                <Image
                  className={`absolute top-[50%] left-[50%] translate-[-50%] w-auto h-full z-2 pointer-events-none ${
                    index === imageIndex
                      ? "opacity-100 scale-[1.1]"
                      : "opacity-25"
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
  );
}
