import { TEST_PRODUCTS } from "@/test";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import Product from "@/components/product";

export default function Shop() {
  return (
    <>
      <TopBar />
      <div className="flex flex-col lg:w-4xl xl:w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 p-8">
          {TEST_PRODUCTS.map((product) => {
            return <Product key={product.id} product={product} />;
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
