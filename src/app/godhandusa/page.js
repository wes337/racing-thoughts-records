import Image from "next/image";
import Link from "next/link";
import { CDN_URL, GODHANDUSA_RELEASE_DATE } from "@/utils";
import Shopify from "@/shopify";
import ShopifyAdmin from "@/shopify-admin";
import Footer from "@/components/footer";
import Cart from "@/components/cart";
import ProductListItem from "@/components/product-list-item";
import GodhandUSACountdown from "@/components/godhandusa-countdown";

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

  return Shopify.getCollectionProductsById(
    GODHANDUSA_COLLECTION_ID,
    100,
    null,
    "MANUAL",
  );
}

export default async function GodhandUSAShopPage({ searchParams }) {
  const params = await searchParams;
  const showDrafts = params?.showDrafts === "true";
  const isLive = showDrafts || Date.now() >= GODHANDUSA_RELEASE_DATE;
  const collectionProducts = isLive
    ? await getGodhandUSACollectionProducts(showDrafts)
    : null;

  const productResults = collectionProducts?.products?.results ?? [];

  return (
    <main className="flex min-h-screen flex-col px-2 py-8 md:px-8 md:py-12 pt-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative flex min-h-[64px] items-center justify-center">
          <a
            className="absolute left-[16px] md:left-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 z-1 active:scale-[1.2]"
            href="https://www.godhandusa.com"
          >
            <Image
              className="w-auto h-full object-contain"
              src={`${CDN_URL}/images/back.png`}
              alt="Back"
              width={250}
              height={209}
            />
          </a>
          <Link
            href="/godhandusa"
            className="flex flex-col opacity-90 hover:opacity-100"
          >
            <Image
              className="h-[80px] w-auto object-contain md:h-[96px]"
              src="/images/artists/godhandusa.png"
              alt="GODHANDUSA"
              width={376}
              height={80}
              priority
            />
          </Link>
          <Cart />
        </header>
        {!isLive ? (
          <GodhandUSACountdown timestamp={GODHANDUSA_RELEASE_DATE} />
        ) : productResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 p-2 md:p-8 md:gap-8 lg:grid-cols-3">
            {productResults.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                theme="godhandusa"
                showDrafts={showDrafts}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center p-8 mt-auto">
            <span className="font-mono text-3xl uppercase tracking-widest md:text-5xl">
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
