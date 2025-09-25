import Image from "next/image";
import Link from "next/link";

export default function ProductListItem({ product }) {
  const longTitle = product.title.length > 21;
  const veryLongTitle = product.title.length > 40;
  const image = product.images.length > 0 ? product.images[0] : "";
  const soldOut =
    product.soldOut ||
    !product.variants.some((variant) => variant.availableForSale);

  return (
    <Link
      className="group flex flex-col w-full h-full max-w-[600px] m-auto cursor-pointer"
      href={`/products/${product.handle}`}
      prefetch
    >
      <div className="relative w-full h-full aspect-square overflow-hidden">
        {soldOut && (
          <div className="absolute bottom-0 right-0 p-2 md:p-4 text-xl md:text-3xl whitespace-nowrap text-red-600 font-black text-shadow-[2px_2px_0_black] z-3 uppercase tracking-tight">
            Sold Out!
          </div>
        )}
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
          className={`flex items-center font-mono font-bold min-h-[42px] md:min-h-auto h-auto md:h-[40px] lg:h-[40px] mt-1 md:mt-0 ${
            longTitle ? "text-sm md:text-md" : "text-md"
          } ${
            veryLongTitle
              ? "text-xs tracking-[-2px] md:tracking-tighter leading-3.5 md:leading-5"
              : "tracking-tighter leading-3.5 md:leading-5"
          } md:text-xl lg:text-xl opacity-90 group-hover:opacity-100`}
        >
          {product.title}
        </div>
        <div className="font-sans font-medium text-sm md:text-xl h-auto md:h-full opacity-80 mt-1 md:mt-0">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
