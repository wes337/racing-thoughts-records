import Image from "next/image";
import Link from "next/link";

export default function ProductListItem({ product }) {
  const longTitle = product.title.length > 21;
  const veryLongTitle = product.title.length > 40;
  const image = product.images.length > 0 ? product.images[0] : "";

  return (
    <Link
      className="group flex flex-col w-full h-full max-w-[600px] m-auto cursor-pointer"
      href={`/products/${product.handle}`}
      prefetch
    >
      <div className="relative w-full h-full aspect-square overflow-hidden">
        <Image
          className="absolute top-0 left-0 w-full h-full z-1 opacity-80 group-hover:opacity-100"
          src={`/images/box-large.png`}
          width={1011}
          height={982}
          alt=""
        />
        <div className="bg-gray-500/10 m-0 md:m-2 rounded-lg overflow-hidden text-center flex items-center h-full md:h-[calc(100%-16px)] justify-center">
          {image ? (
            <Image
              className="w-[calc(100%-4px)] h-[calc(100%-4px)] md:w-full md:h-full object-contain group-hover:scale-[1.1]"
              src={product.images[0]}
              alt=""
              width={2672}
              height={2672}
            />
          ) : (
            <span className="italic text-2xl md:text-4xl font-bold text-red-500 font-display">
              Missing image
            </span>
          )}
        </div>
      </div>
      <div>
        <div
          className={`flex items-center leading-none font-mono font-bold h-[36px] lg:h-[40px] leading-6 ${
            longTitle ? "text-sm md:text-md" : "text-md"
          } ${
            veryLongTitle ? "text-xs leading-none" : ""
          } md:text-xl lg:text-xl tracking-tighter opacity-90 group-hover:opacity-100`}
        >
          {product.title}
        </div>
        <div className="font-sans font-medium text-sm md:text-xl h-full opacity-80">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
