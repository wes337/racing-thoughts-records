import Shopify from "@/shopify";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const CONTACT_PAGE_ID = "gid://shopify/Page/151623631136";

export default async function ContactPage() {
  const page = await Shopify.getPage(CONTACT_PAGE_ID);

  return (
    <>
      <TopBar />
      <div className="flex flex-col w-[90vw] lg:w-4xl md:mx-auto my-4">
        <h1 className="text-3xl text-center font-bold uppercase opacity-75">
          {page.title}
        </h1>
        <div
          className="policy p-4 text-sm tracking-tight"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </div>
      <Footer />
    </>
  );
}
