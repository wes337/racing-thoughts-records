import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CDN_URL, GODHANDUSA_RELEASE_DATE } from "@/utils";
import Shopify from "@/shopify";
import ShopifyAdmin from "@/shopify-admin";
import Footer from "@/components/footer";
import Cart from "@/components/cart";
import GodhandUSAProduct from "@/components/godhandusa-product";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const GODHANDUSA_COLLECTION_ID = "gid://shopify/Collection/517340037408";

export default async function GodhandUSAProductPage({ params, searchParams }) {
  const { handle } = await params;
  const query = await searchParams;
  const showDrafts = query?.showDrafts === "true";

  if (!showDrafts && Date.now() < GODHANDUSA_RELEASE_DATE) {
    redirect("/godhandusa");
  }

  let product = null;

  if (showDrafts) {
    try {
      product = await ShopifyAdmin.getDraftProductByHandle(
        handle,
        GODHANDUSA_COLLECTION_ID,
      );
    } catch (error) {
      console.error("Failed to load GODHANDUSA draft product", error);
    }
  }

  if (!product) {
    product = await Shopify.getProduct(handle);
  }

  if (!product) {
    notFound();
  }

  const backHref = showDrafts ? "/godhandusa?showDrafts=true" : "/godhandusa";

  return (
    <main className="flex min-h-screen flex-col px-2 py-8 md:px-8 md:py-10 pt-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative flex min-h-[80px] items-center justify-center">
          <Link
            className="absolute left-[16px] md:left-[32px] h-[32px] md:h-[40px] cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 z-1 active:scale-[1.2]"
            href={backHref}
          >
            <Image
              className="w-auto h-full object-contain"
              src={`${CDN_URL}/images/back.png`}
              alt="Back"
              width={250}
              height={209}
            />
          </Link>
          <Link
            href={backHref}
            className="flex flex-col opacity-90 hover:opacity-100"
          >
            <Image
              className="h-[64px] w-auto md:h-[96px] object-contain"
              src="/images/artists/godhandusa.png"
              alt="GODHANDUSA"
              width={376}
              height={80}
              priority
            />
          </Link>
          <Cart />
        </header>
        <Suspense>
          <GodhandUSAProduct product={product} />
        </Suspense>
      </div>
      <div className="mt-auto">
        <Footer theme="godhandusa" />
      </div>
    </main>
  );
}
