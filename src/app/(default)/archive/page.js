import Shopify from "@/shopify";
import { pageMetadata } from "@/metadata";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Archive",
  description:
    "Sold out vinyl, CDs and cassettes from Racing Thoughts Records, the official store for music by Joshua Hamilton.",
  path: "/archive",
});

// Storefront API page size limit. The whole catalog fits in one page.
const MAX_PRODUCTS = 250;

// Lists every sold out product on the regular site. GODHANDUSA merch is only
// shown on the /godhandusa route, so it is left out here.
export default async function ArchivePage() {
  const { results } = await Shopify.getProducts(MAX_PRODUCTS);
  const products = results.filter(
    (product) => product.soldOut && !Shopify.isGodhandUSAProduct(product),
  );

  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
        <h1 className="mt-4 text-center font-display font-bold text-6xl md:text-8xl tracking-wide opacity-75 [text-shadow:1px_0px_0px_currentColor]">
          Archive
        </h1>
        {products.length === 0 ? (
          <div className="p-8 text-center font-sans font-medium opacity-80">
            Nothing here yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-2 md:p-8 md:gap-8 lg:grid-cols-3">
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
