import { Suspense } from "react";
import Shopify from "@/shopify";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import Product from "@/components/product";

export default async function ProductPage({ params }) {
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
      <Footer fixed />
    </>
  );
}
