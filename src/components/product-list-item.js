import Image from "next/image";
import Link from "next/link";

export default function ProductListItem({ product }) {
  const longTitle = product.title.length > 21;

  return (
    <Link
      className="group flex flex-col w-full h-full max-w-[500px] m-auto cursor-pointer"
      href={`/products/${product.handle}`}
    >
      <div className="w-full h-full aspect-square bg-gray-500/10 overflow-hidden">
        <Image
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.1]"
          src={product.images[0]}
          alt=""
          width={2672}
          height={2672}
        />
      </div>
      <div>
        <div
          className={`flex items-center font-mono font-bold h-[36px] leading-4  ${
            longTitle ? "text-md tracking-[-2px]" : "text-lg tracking-tighter"
          }  md:text-xl xl:tracking-normal opacity-90 group-hover:opacity-100`}
        >
          {product.title}
        </div>
        <div className="font-sans font-medium text-xl md:text-2xl h-full opacity-80">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
