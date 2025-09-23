import Shopify from "@/shopify";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const DEFAULT_COLLECTION = "vinyl";

export default async function ShopPage() {
  const { products } = await Shopify.getCollectionProducts(DEFAULT_COLLECTION);

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
