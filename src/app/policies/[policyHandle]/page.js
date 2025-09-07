import Shopify from "@/shopify";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";

export default async function PolicyPage({ params }) {
  const { policyHandle } = await params;
  const policy = await Shopify.getPolicy(policyHandle);

  if (!policy) {
    return (
      <>
        <TopBar />
        <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
          Sorry, we couldn&apos;t find that page.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl mx-auto my-4">
        <h1 className="text-3xl text-center font-bold uppercase opacity-75">
          {policy.title}
        </h1>
        <div
          className="policy p-4 text-sm tracking-tight"
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </div>
      <Footer />
    </>
  );
}
