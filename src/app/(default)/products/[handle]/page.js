import { cache, Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Shopify from "@/shopify";
import {
  productMetadata,
  productStructuredData,
  serializeStructuredData,
} from "@/product-seo";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import Product from "@/components/product";

export const revalidate = 0;
export const dynamic = "force-dynamic";

// React shares this lookup between metadata and the page within a single
// server request. A later visit always asks Shopify again.
const getProduct = cache((handle) => Shopify.getProduct(handle));

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  return product ? productMetadata(product) : { title: "Not Found" };
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  if (Shopify.isGodhandUSAProduct(product)) {
    redirect(`/godhandusa/products/${product.handle}`);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(productStructuredData(product)),
        }}
      />
      <TopBar hideBackground />
      <div className="flex flex-col lg:w-4xl xl:w-7xl 2xl:w-[1400px] mx-auto">
        <Suspense>
          <Product product={product} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
