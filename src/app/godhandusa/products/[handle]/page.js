import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Shopify from "@/shopify";
import Footer from "@/components/footer";
import Cart from "@/components/cart";
import GodhandUSAProduct from "@/components/godhandusa-product";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function GodhandUSAProductPage({ params }) {
  const { handle } = await params;
  const product = await Shopify.getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col px-2 py-8 md:px-8 md:py-10 pt-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative flex min-h-[80px] items-center justify-center">
          <Link
            className="absolute top-0 left-0 mx-2 font-mono text-sm font-normal text-[#00ff6a] opacity-90 hover:opacity-100 md:text-base"
            href="/godhandusa"
          >
            &lt;&lt; RETURN
          </Link>
          <Link
            href="/godhandusa"
            className="flex flex-col opacity-90 hover:opacity-100"
          >
            <Image
              className="h-[64px] w-auto md:h-[80px] object-contain"
              src="/images/artists/godhandusa-green.png"
              alt="GODHANDUSA"
              width={376}
              height={80}
              priority
            />
            <Image
              className="invert opacity-80 px-4 pt-4 max-w-[400px]"
              src="/images/logo-text-horizontal.png"
              alt="Racing Thoughts Records."
              width={2085}
              height={136}
              priority
            />
          </Link>
          <Cart invert />
        </header>
        <Suspense>
          <GodhandUSAProduct product={product} />
        </Suspense>
      </div>
      <Footer theme="godhandusa" />
    </main>
  );
}
