"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [loading, setLoading] = useState(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  const soldOut =
    product.soldOut ||
    !product.variants.some((variant) => variant.availableForSale);
  const longTitle = product.title.length > 21;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    if (showFullscreenImage) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showFullscreenImage]);

  const onAddToCart = async () => {
    if (loading || !cart || soldOut || !selectedVariant || quantity <= 0) {
      return;
    }

    setLoading(true);

    await Shopify.addToCart(cart.id, [
      { merchandiseId: selectedVariant, quantity },
    ]);

    const event = new CustomEvent("updatecart");
    document.dispatchEvent(event);

    if (product.variants.length > 1) {
      setSelectedVariant("");
    }

    setCartOpen(true);
    setLoading(false);
    setQuantity(1);
  };

  const onBuyItNow = async () => {
    if (loading || soldOut || !selectedVariant) {
      return;
    }

    setLoading(true);

    await Shopify.buyItNow([{ merchandiseId: selectedVariant, quantity: 1 }]);

    setLoading(false);
    setQuantity(1);
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
        <div className="fixed top-0 left-0 w-full h-full z-0 mix-blend-color-burn opacity-20 grayscale-100 md:grayscale-50 pointer-events-none select-none">
          <Image
            className="w-full h-full object-cover pointer-events-none select-none"
            src={`${CDN_URL}/images/custom-bg/${product.handle}.png`}
            width={2351}
            height={1080}
            alt=""
          />
        </div>
      )}
      <div className="flex flex-col items-center xl:gap-8 md:flex-row lg:w-4xl xl:w-full min-h-[calc(100vh-140px)] md:max-w-[90vw] md:mx-auto">
        <MobilePhotos
          product={product}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          gotoNextImage={gotoNextImage}
          gotoPreviousImage={gotoPreviousImage}
          onShowFullscreenImage={() => setShowFullscreenImage(true)}
        />
        <DesktopPhotos
          product={product}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          onShowFullscreenImage={() => setShowFullscreenImage(true)}
        />
        {showFullscreenImage && (
          <FullscreenImage
            product={product}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            onCloseFullscreenImage={() => setShowFullscreenImage(false)}
          />
        )}
        <div className="relative flex flex-col p-4 md:w-full bg-white mt-2 md:mt-0 mobile-menu-bg">
          <Image
            className="absolute top-0 left-0 w-full h-full z-0 scale-[1.03]"
            src={`${CDN_URL}/images/box-large.png`}
            width={1011}
            height={982}
            alt=""
          />
          <h2
            className={`font-mono font-bold leading-8 xl:leading-10 ${
              longTitle
                ? "text-[1.8rem] tracking-[-3px] lg:tracking-tight xl:tracking-tight xl:text-4xl"
                : "text-[2rem] xl:text-4xl tracking-tighter"
            } opacity-90 text-left`}
          >
            {product.title}
          </h2>
          <h3 className="font-sans font-medium text-2xl min-[1921px]:text-3xl mt-2 opacity-80">
            {product.price}
          </h3>
          <p className="font-sans font-light py-4 text-sm min-[1921px]:text-lg md:my-4 md:text-md opacity-80">
            {product.description}
          </p>
          <div className="group flex flex-col mb-2 md:mb-4 hover:scale-[1.01] hover:translate-x-[2px]">
            <div className="text-xs md:text-md min-[1921px]:text-lg font-bold leading-none mb-1 opacity-60 uppercase group-hover:opacity-100">
              Quantity
            </div>
            <div className="relative flex w-[33%] h-[48px] md:h-[64px]">
              <button
                className="w-[50%] h-full flex items-center justify-center cursor-pointer font-bold text-lg md:text-2xl"
                onClick={() =>
                  setQuantity((quantity) => Math.max(quantity - 1, 1))
                }
                disabled={loading}
              >
                -
              </button>
              <div className="w-full flex items-center justify-center text-center font-bold text-lg md:text-2xl">
                {quantity}
              </div>
              <button
                className="w-[50%] h-full flex items-center justify-center cursor-pointer font-bold text-lg md:text-2xl"
                onClick={() => setQuantity((quantity) => quantity + 1)}
                disabled={loading}
              >
                +
              </button>
              <Image
                className="absolute w-full h-full pointer-events-none opacity-85 group-hover:opacity-100 group-hover:brightness-50"
                src={`${CDN_URL}/images/box.png`}
                width={605}
                height={214}
                alt=""
              />
            </div>
          </div>
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
  onShowFullscreenImage,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const altText = product.imageAltTexts[imageIndex];

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
          src={`${CDN_URL}/images/box-large.png`}
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
              className="absolute top-0 left-0 w-[calc(100%-10px)] h-[calc(100%-10px)] m-1 rounded-lg overflow-hidden z-1"
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
        {altText && (
          <div className="absolute bottom-[24px] left-0 w-full z-2 text-sm text-center tracking-[-1px]">
            {altText}
          </div>
        )}
        <div className="absolute bottom-[-8px] left-[50%] translate-x-[-50%] flex items-center justify-center w-full z-2 text-center tracking-[-2px]">
          <div className="flex items-center justify-center w-[64px] text-center bg-black text-white text-sm px-2 py-1 rounded-xl">
            {imageIndex + 1} / {product.images.length}
          </div>
        </div>
        <div className="absolute top-[16px] right-[16px] z-3">
          <button
            className="w-[48px] h-[48px] p-2 cursor-pointer hover:scale-[1.2]"
            onClick={onShowFullscreenImage}
          >
            <Image
              className="w-full h-full"
              src={`${CDN_URL}/images/zoom.png`}
              width={123}
              height={123}
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function DesktopPhotos({
  product,
  imageIndex,
  setImageIndex,
  onShowFullscreenImage,
}) {
  const altText = product.imageAltTexts[imageIndex];

  return (
    <div className="hidden md:flex flex-col items-center justify-center w-full h-full">
      <div className="relative h-[33vw] rounded-xl w-[33vw] overflow-hidden bg-gray-300/10 m-auto">
        {altText && (
          <div className="absolute bottom-[24px] left-0 w-full z-2 text-center tracking-[-2px] min-[1921px]:text-lg">
            {altText}
          </div>
        )}
        <div className="absolute top-[28px] right-[28px] z-3">
          <button
            className="w-[48px] h-[48px] p-2 cursor-pointer opacity-80 hover:scale-[1.2] hover:opacity-100"
            onClick={onShowFullscreenImage}
          >
            <Image
              className="w-full h-full"
              src={`${CDN_URL}/images/zoom.png`}
              width={123}
              height={123}
              alt=""
            />
          </button>
        </div>
        <Image
          className="absolute top-0 left-0 w-full h-full z-2"
          src={`${CDN_URL}/images/box-large.png`}
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
                  src={`${CDN_URL}/images/box-large.png`}
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

function FullscreenImage({ product, imageIndex, onCloseFullscreenImage }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full z-50 overflow-y-auto bg-white">
      <button
        className="fixed top-[12px] right-[16px] md:right-[32px] h-[32px] md:h-[64px] z-1 opacity-85 cursor-pointer hover:scale-[1.1] hover:opacity-100 active:scale-[1.2]"
        onClick={onCloseFullscreenImage}
      >
        <Image
          className="w-auto h-full object-contain"
          src={`${CDN_URL}/images/close.png`}
          alt="Close"
          width={138}
          height={112}
        />
      </button>
      <Image
        className="w-full min-h-screen object-contain"
        src={product.images[imageIndex]}
        width={1024}
        height={1024}
        unoptimized
        alt=""
      />
    </div>,
    document.body
  );
}
