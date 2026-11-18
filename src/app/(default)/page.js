import Link from "next/link";
import Shopify from "@/shopify";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const DEFAULT_COLLECTION = "frontpage";

export default async function HomePage() {
  const { products } = await Shopify.getCollectionProducts(DEFAULT_COLLECTION);

  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-4 p-2 md:p-8 md:gap-8 lg:grid-cols-3">
          {/* Sold out products live on /archive instead. */}
          {products.results
            .filter((product) => !product.soldOut)
            .map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
        </div>
        <Link
          className="mx-auto my-8 font-display font-bold text-6xl md:text-8xl tracking-wide opacity-75 hover:opacity-100 hover:scale-[1.1] active:scale-[1.2] [text-shadow:1px_0px_0px_currentColor]"
          href="/archive"
        >
          Archive
        </Link>
      </div>
      <Footer />
    </>
  );
}
