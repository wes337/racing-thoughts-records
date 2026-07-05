"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import Shopify from "@/shopify";
import { useCart } from "@/state";

const GREEN = "#00ff6a";

function formatPrice(price) {
  const value = String(price);
  return value.startsWith("$") ? value : `$${Number(value).toFixed(2)}`;
}

export default function GodhandUSAProduct({ product }) {
  const [cart, setCartOpen] = useCart(
    useShallow((state) => [state.cart, state.setOpen]),
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length === 1 ? product.variants[0].id : "",
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const preview = Boolean(product.previewOnly);
  const soldOut =
    product.soldOut ||
    !product.variants.some((variant) => variant.availableForSale);
  const purchasable = !soldOut;

  const hasImages = product.images.length > 0;
  const hasMultipleImages = product.images.length > 1;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const gotoNextImage = () => {
    setImageIndex((index) => (index + 1) % product.images.length);
  };

  const gotoPreviousImage = () => {
    setImageIndex(
      (index) => (index - 1 + product.images.length) % product.images.length,
    );
  };

  const onAddToCart = async () => {
    if (
      loading ||
      preview ||
      !cart ||
      !purchasable ||
      !selectedVariant ||
      quantity <= 0
    ) {
      return;
    }

    setLoading(true);

    await Shopify.addToCart(cart.id, [
      { merchandiseId: selectedVariant, quantity },
    ]);

    document.dispatchEvent(new CustomEvent("updatecart"));

    if (product.variants.length > 1) {
      setSelectedVariant("");
    }

    setCartOpen(true);
    setLoading(false);
    setQuantity(1);
  };

  const onBuyItNow = async () => {
    if (loading || preview || !purchasable || !selectedVariant) {
      return;
    }

    setLoading(true);

    await Shopify.buyItNow([{ merchandiseId: selectedVariant, quantity }]);

    setLoading(false);
    setQuantity(1);
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-10 md:items-start md:my-6">
      <div className="relative z-10 flex w-full flex-col gap-3 md:w-1/2">
        <div className="relative aspect-square w-full overflow-hidden bg-black outline-4 outline-[#00ff6a]/25">
          {hasImages ? (
            <>
              <Image
                className="h-full w-full object-contain"
                src={product.images[imageIndex]}
                alt={product.imageAltTexts[imageIndex] || product.title}
                width={1024}
                height={1024}
              />
              {hasMultipleImages && (
                <>
                  <button
                    className="absolute top-0 left-0 z-2 h-full w-1/2 cursor-pointer"
                    onClick={gotoPreviousImage}
                    aria-label="Previous image"
                  />
                  <button
                    className="absolute top-0 right-0 z-2 h-full w-1/2 cursor-pointer"
                    onClick={gotoNextImage}
                    aria-label="Next image"
                  />
                  <div className="absolute bottom-3 left-1/2 z-3 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 font-mono text-xs text-[#00ff6a]">
                    {imageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
        {hasMultipleImages && (
          <div className="flex flex-wrap gap-2">
            {product.images.map((image, index) => (
              <button
                key={image}
                className={`h-16 w-16 cursor-pointer overflow-hidden bg-black outline-2 ${
                  index === imageIndex
                    ? "outline-[#00ff6a]"
                    : "outline-[#00ff6a]/25"
                }`}
                onClick={() => setImageIndex(index)}
              >
                <Image
                  className="h-full w-full object-contain"
                  src={image}
                  alt=""
                  width={128}
                  height={128}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col md:w-1/2">
        <h1
          className="font-mono text-3xl font-bold tracking-tighter md:text-4xl"
          style={{ color: GREEN }}
        >
          {product.title}
        </h1>
        <div
          className="mt-2 font-sans text-2xl font-medium opacity-90"
          style={{ color: GREEN }}
        >
          {formatPrice(product.price)}
        </div>

        {product.descriptionHtml && (
          <div
            className="description mt-6 font-sans text-sm font-light leading-relaxed opacity-80 md:text-base"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}

        {soldOut && (
          <div className="mt-8 inline-flex w-fit items-center border-2 border-[#e1251b]/60 px-4 py-2 font-mono text-sm uppercase tracking-widest text-[#e1251b]">
            Sold Out
          </div>
        )}

        {purchasable && (
          <div className="mt-8 mb-8 flex flex-col gap-5">
            {product.variants.length > 1 && (
              <label className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-[#00ff6a]/70">
                  Option
                </span>
                <select
                  className="border-2 border-[#00ff6a]/40 bg-black px-3 py-2 font-mono text-sm text-[#00ff6a] outline-none focus:border-[#00ff6a]"
                  value={selectedVariant}
                  onChange={(event) => setSelectedVariant(event.target.value)}
                >
                  <option value="">Select…</option>
                  {product.variants.map((variant) => (
                    <option
                      key={variant.id}
                      value={variant.id}
                      disabled={!variant.availableForSale}
                    >
                      {variant.title}
                      {variant.availableForSale ? "" : " — Sold Out"}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00ff6a]/70">
                Quantity
              </span>
              <div className="flex h-12 w-32 items-center border-2 border-[#00ff6a]/40">
                <button
                  className="flex h-full w-12 cursor-pointer items-center justify-center font-mono text-xl text-[#00ff6a] disabled:cursor-default disabled:opacity-40"
                  onClick={() =>
                    setQuantity((current) => Math.max(current - 1, 1))
                  }
                  disabled={loading}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="flex w-full items-center justify-center font-mono text-lg text-[#00ff6a]">
                  {quantity}
                </div>
                <button
                  className="flex h-full w-12 cursor-pointer items-center justify-center font-mono text-xl text-[#00ff6a] disabled:cursor-default disabled:opacity-40"
                  onClick={() => setQuantity((current) => current + 1)}
                  disabled={loading}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="flex w-full cursor-pointer items-center justify-center border-2 border-[#00ff6a]/40 px-6 py-3.5 font-mono text-base uppercase tracking-widest text-[#00ff6a]/80 hover:border-[#00ff6a] hover:text-[#00ff6a] disabled:cursor-default disabled:opacity-40 sm:w-52 md:py-5 md:text-lg lg:w-64"
                onClick={onAddToCart}
                disabled={loading || preview || !selectedVariant}
              >
                Add to Cart
              </button>
              <button
                className="flex w-full cursor-pointer items-center justify-center border-2 border-[#00ff6a] bg-[#00ff6a] px-6 py-3.5 font-mono text-base uppercase tracking-widest text-black hover:bg-[#00ff6a]/80 disabled:cursor-default disabled:opacity-40 sm:w-52 md:py-5 md:text-lg lg:w-64"
                onClick={onBuyItNow}
                disabled={loading || preview || !selectedVariant}
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
