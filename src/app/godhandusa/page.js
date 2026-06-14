import Image from "next/image";
import Link from "next/link";
import Shopify from "@/shopify";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const DEFAULT_COLLECTION = "frontpage";

export default async function GodhandUSAShopPage() {
  const { products } = await Shopify.getCollectionProducts(DEFAULT_COLLECTION);

  return (
    <main className="flex min-h-screen flex-col px-2 py-8 md:px-8 md:py-12 pt-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative flex min-h-[64px] items-center justify-center">
          <Link
            className="absolute top-0 left-0 mx-2 font-mono text-sm font-normal text-[#00ff6a] opacity-90 hover:opacity-100 md:text-base"
            href="/shop"
          >
            &lt;&lt; RETURN
          </Link>
          <Image
            className="h-[80px] w-auto"
            src="/images/artists/godhandusa-green.png"
            alt="GODHANDUSA"
            width={376}
            height={80}
            priority
          />
        </header>
        <div className="grid grid-cols-2 gap-4 p-2 md:p-8 md:gap-8 lg:grid-cols-3">
          {products.results.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              theme="godhandusa"
            />
          ))}
        </div>
      </div>
      <Footer theme="godhandusa" />
    </main>
  );
}
