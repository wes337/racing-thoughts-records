import Shopify from "@/shopify";
import { isLive } from "@/utils";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";
import ComingSoon from "@/components/coming-soon";

export default async function ShopPage() {
  if (!isLive()) {
    return <ComingSoon />;
  }

  const products = await Shopify.getProducts();

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
