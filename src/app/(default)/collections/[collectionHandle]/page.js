import { cache } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import Shopify from "@/shopify";
import { CDN_URL, GODHANDUSA_COLLECTION_ID } from "@/utils";
import { pageMetadata } from "@/metadata";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import ProductListItem from "@/components/product-list-item";

export const revalidate = 0;
export const dynamic = "force-dynamic";

// React shares this lookup between metadata and the page within a single
// server request. A later visit always asks Shopify again.
const getCollectionProducts = cache((handle) =>
  Shopify.getCollectionProducts(handle),
);

export async function generateMetadata({ params }) {
  const { collectionHandle } = await params;
  const { collection } = await getCollectionProducts(collectionHandle);

  if (!collection) {
    return { title: "Not Found" };
  }

  return pageMetadata({
    title: collection.title,
    description:
      collection.description ||
      `${collection.title} from Racing Thoughts Records, the official store for music by Joshua Hamilton.`,
    path: `/collections/${collection.handle}`,
  });
}

export default async function CollectionPage({ params }) {
  const { collectionHandle } = await params;
  const { collection, products } =
    await getCollectionProducts(collectionHandle);

  if (collection?.id === GODHANDUSA_COLLECTION_ID) {
    redirect("/godhandusa");
  }

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
        <h1 className="sr-only">{collection.title}</h1>
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
