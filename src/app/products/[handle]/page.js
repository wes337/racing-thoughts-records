import { Suspense } from "react";
import Shopify from "@/shopify";
import { isLive } from "@/utils";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import Product from "@/components/product";
import ComingSoon from "@/components/coming-soon";

export default async function ProductPage({ params }) {
  if (!isLive()) {
    return <ComingSoon />;
  }

  const { handle } = await params;
  const product = await Shopify.getProduct(handle);

  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
        <Suspense>
          <Product product={product} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
