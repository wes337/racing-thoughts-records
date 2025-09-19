import Image from "next/image";
import Shopify from "@/shopify";
import { isLive, CDN_URL } from "@/utils";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";
import ComingSoon from "@/components/coming-soon";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }) {
  if (!isLive()) {
    return <ComingSoon />;
  }

  const { collectionHandle } = await params;
  const { products } = await Shopify.getCollectionProducts(collectionHandle);

  if (!products) {
    return (
      <>
        <TopBar />
        <div className="flex flex-col lg:w-4xl xl:w-7xl m-auto mt-8 text-center font-bold opacity-75 font-display text-6xl">
          Sorry, we couldn&apos;t find that page.
        </div>
        <Footer />
      </>
    );
  }

  if (products.results.length === 0) {
    return (
      <>
        <TopBar />
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
          <Image
            className="opacity-75"
            src={`${CDN_URL}/images/logo-black.png`}
            width={652}
            height={471}
            alt=""
          />
          <div className="font-bold font-display text-9xl opacity-75 [text-shadow:5px_1px_0px_currentColor] tracking-wide leading-20 mt-8">
            Coming Soon
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-4 p-2 md:p-8 md:gap-8">
          {products.results.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
