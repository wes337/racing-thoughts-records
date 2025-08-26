import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";

export default function ComingSoon() {
  return (
    <>
      <TopBar />
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center font-bold font-display text-9xl opacity-75 [text-shadow:5px_1px_0px_currentColor] tracking-wide leading-20 text-center">
        Coming Soon
      </div>
      <Footer fixed />
    </>
  );
}
