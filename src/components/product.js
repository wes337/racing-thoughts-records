import Image from "next/image";
import Link from "next/link";

export default function Product({ product }) {
  const longTitle = product.title.length > 21;

  return (
    <Link
      className="group flex flex-col w-full h-full max-w-[500px] m-auto cursor-pointer"
      href={`/products/${product.id}`}
    >
      <div className="w-full h-full aspect-square bg-gray-500/10 overflow-hidden">
        <Image
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.1]"
          src={product.photo}
          alt=""
          width={2672}
          height={2672}
        />
      </div>
      <div>
        <div
          className={`flex items-center font-display font-bold h-[36px] leading-8 tracking-tight ${
            longTitle ? "text-lg leading-none" : "text-2xl"
          } md:text-4xl xl:tracking-normal [text-shadow:1px_0px_0px_currentColor] opacity-80 group-hover:opacity-100`}
        >
          {product.title}
        </div>
        <div className="font-sans font-bold text-xl md:text-2xl h-full opacity-80">
          $20
        </div>
      </div>
    </Link>
  );
}
