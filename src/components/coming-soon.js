import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import Image from "next/image";

export default function ComingSoon() {
  return (
    <>
      <TopBar />
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
        <Image
          className="opacity-75"
          src={`/images/logo-black.png`}
          width={652}
          height={471}
          alt=""
        />
        <div className="font-bold font-display text-9xl opacity-80 [text-shadow:5px_1px_0px_currentColor] tracking-wide leading-20 mt-8">
          Coming Soon
        </div>
      </div>
      {/* <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center font-bold font-display text-9xl opacity-75 [text-shadow:5px_1px_0px_currentColor] tracking-wide leading-20 text-center">
        Coming Soon
      </div> */}
      <Footer />
    </>
  );
}
