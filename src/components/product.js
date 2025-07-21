"use client";

import { useState } from "react";
import Image from "next/image";

export default function Product({ product }) {
  const longTitle = product.title.length > 21;

  return (
    <div className="flex flex-col md:flex-row lg:w-4xl xl:w-full">
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
            longTitle ? "text-3xl tracking-tighter xl:text-5xl" : ""
          } [text-shadow:1px_0px_0px_currentColor]`}
        >
          {product.title}
        </h2>
        <h3 className="font-sans font-bold text-2xl mt-2">{product.price}</h3>
        <p className="font-sans font-light py-4 md:my-4 text-md">
          {product.description}
        </p>
        <div className="flex items-start gap-4">
          <button className="cursor-pointer h-[64px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05]">
            <Image
              className="w-full h-full object-contain"
              src={`/images/add-to-cart.png`}
              width={997}
              height={224}
              alt="Add to Cart"
            />
          </button>
          <button className="cursor-pointer h-[64px] opacity-90 hover:opacity-100 hover:brightness-50 hover:scale-[1.05]">
            <Image
              className="w-full h-full object-contain"
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
