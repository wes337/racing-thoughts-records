import Image from "next/image";
import Link from "next/link";
import Shopify from "@/shopify";
import ShopifyAdmin from "@/shopify-admin";
import Footer from "@/components/footer";
import Cart from "@/components/cart";
import ProductListItem from "@/components/product-list-item";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const GODHANDUSA_COLLECTION_ID = "gid://shopify/Collection/517340037408";

async function getGodhandUSACollectionProducts(showDrafts) {
  if (showDrafts) {
    try {
      return await ShopifyAdmin.getDraftProductsByCollectionId(
        GODHANDUSA_COLLECTION_ID,
      );
    } catch (error) {
      console.error("Failed to load GODHANDUSA draft products", error);
      return null;
    }
  }

  return Shopify.getCollectionProductsById(GODHANDUSA_COLLECTION_ID);
}

export default async function GodhandUSAShopPage({ searchParams }) {
  const params = await searchParams;
  const showDrafts = params?.showDrafts === "true";
  const collectionProducts = await getGodhandUSACollectionProducts(showDrafts);

  const productResults = collectionProducts?.products?.results ?? [];

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
          <Link
            href="/shop"
            className="flex flex-col opacity-90 hover:opacity-100"
          >
            <Image
              className="h-[80px] w-auto object-contain"
              src="/images/artists/godhandusa-green.png"
              alt="GODHANDUSA"
              width={376}
              height={80}
              priority
            />
          </Link>
          <Cart invert />
        </header>
        {productResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 p-2 md:p-8 md:gap-8 lg:grid-cols-3">
            {productResults.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                theme="godhandusa"
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center p-8 mt-auto">
            <span className="font-mono text-3xl uppercase tracking-widest text-[#00ff6a] md:text-5xl">
              Coming Soon
            </span>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <Footer theme="godhandusa" />
      </div>
    </main>
  );
}
