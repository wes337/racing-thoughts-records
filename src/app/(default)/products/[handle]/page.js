import { Suspense } from "react";
import Shopify from "@/shopify";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import Product from "@/components/product";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await Shopify.getProduct(handle);

  return (
    <>
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
