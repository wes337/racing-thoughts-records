import Image from "next/image";
import Link from "next/link";

export default function ProductListItem({ product }) {
  const longTitle = product.title.length > 21;

  return (
    <Link
      className="group flex flex-col w-full h-full max-w-[500px] m-auto cursor-pointer"
      href={`/products/${product.handle}`}
    >
      <div className="relative w-full h-full aspect-square overflow-hidden">
        <Image
          className="absolute top-0 left-0 w-full h-full z-1 opacity-80 group-hover:opacity-100"
          src={`/images/box-large.png`}
          width={1011}
          height={982}
          alt=""
        />
        <div className="bg-gray-500/10 m-1 md:m-2 rounded-lg overflow-hidden">
          <Image
            className="w-full h-full object-contain group-hover:scale-[1.1]"
            src={product.images[0]}
            alt=""
            width={2672}
            height={2672}
          />
        </div>
      </div>
      <div>
        <div
          className={`flex items-center leading-none font-mono font-bold h-[36px] lg:h-[40px] leading-6  ${
            longTitle ? "text-md tracking-[-2px]" : "text-lg tracking-tighter"
          }  md:text-xl lg:text-2xl xl:tracking-normal opacity-90 group-hover:opacity-100`}
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
