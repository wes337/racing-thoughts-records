import Image from "next/image";
import Link from "next/link";
import { CDN_URL, TAGS } from "@/utils";

export default function ProductListItem({ product, theme }) {
  const isGodhandUSA = theme === "godhandusa";
  const longTitle = product.title.length > 21;
  const veryLongTitle = product.title.length > 40;
  const image = product.images.length > 0 ? product.images[0] : "";
  const soldOut =
    product.soldOut ||
    !product.variants.some((variant) => variant.availableForSale);

  const renderTag = () => {
    if (soldOut) {
      return (
        <div className="absolute top-0 right-0 md:m-2 z-3 w-[66%] md:w-[50%] rotate-15 group-hover:scale-[1.1]">
          <Image
            src={`${CDN_URL}/images/sold-out.png`}
            width={461}
            height={264}
            alt="Sold Out"
          />
        </div>
      );
    }

    const tag = TAGS.find(({ id }) => product.tags.includes(id));

    if (!tag) {
      return null;
    }

    return (
      <div className="absolute top-0 right-0 mx-2 my-4 md:mx-4 md:my-6 z-3 w-[50%] md:w-[40%] rotate-10 group-hover:scale-[1.1]">
        <Image src={tag.image} width={389} height={145} alt={tag.label} />
      </div>
    );
  };

  const href = isGodhandUSA
    ? `/godhandusa/products/${product.handle}`
    : `/products/${product.handle}`;

  return (
    <Link
      className="group flex flex-col w-full h-full max-w-[600px] m-auto cursor-pointer"
      href={href}
      prefetch
    >
      <div className="relative w-full h-full aspect-square overflow-hidden">
        {!isGodhandUSA && renderTag()}
        {!isGodhandUSA && (
          <Image
            className="absolute top-0 left-0 w-full h-full z-1 opacity-80 group-hover:opacity-100"
            src={`${CDN_URL}/images/box-large.png`}
            width={1011}
            height={982}
            alt=""
          />
        )}
        <div
          className={`m-0 md:m-2 overflow-hidden text-center flex items-center h-full md:h-[calc(100%-16px)] justify-center ${
            isGodhandUSA && !image ? "bg-black" : "bg-gray-500/10"
          } ${
            isGodhandUSA
              ? "rounded-none outline-4 -outline-offset-4 md:outline-offset-0 outline-green-800/25 group-hover:outline-green-800 group-focus:outline-green-800"
              : "rounded-lg"
          }`}
        >
          {image ? (
            <Image
              className={`w-[calc(100%-4px)] h-[calc(100%-4px)] md:w-full md:h-full object-contain group-hover:scale-[1.1] ${
                isGodhandUSA ? "relative z-10" : ""
              }`}
              src={product.images[0]}
              alt=""
              width={2672}
              height={2672}
            />
          ) : isGodhandUSA ? null : (
            <span className="italic text-2xl md:text-4xl font-bold text-red-500 font-display">
              Missing image
            </span>
          )}
        </div>
      </div>
      <div>
        <div
          className={`flex items-center font-mono font-bold min-h-[42px] md:min-h-auto h-auto md:h-[40px] lg:h-[40px] mt-1 md:mt-0 ${
            longTitle ? "text-sm md:text-md" : "text-md"
          } ${
            veryLongTitle
              ? "text-xs tracking-[-2px] md:tracking-tighter leading-3.5 md:leading-5"
              : "tracking-tighter leading-3.5 md:leading-5"
          } md:text-xl lg:text-xl opacity-90 group-hover:opacity-100 ${isGodhandUSA ? "text-green-600" : ""}`}
        >
          {product.title}
        </div>
        <div
          className={`font-sans font-medium text-sm md:text-xl h-auto md:h-full opacity-80 mt-1 md:mt-0 ${isGodhandUSA ? "text-green-800" : ""}`}
        >
          ${Number(product.price).toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
