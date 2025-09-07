import Shopify from "@/shopify";
import { isLive } from "@/utils";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";
import ComingSoon from "@/components/coming-soon";

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
        <div className="flex flex-col lg:w-4xl xl:w-7xl m-auto mt-8 text-center font-bold opacity-75 font-display text-6xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          Coming Soon
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 p-8">
          {products.results.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
