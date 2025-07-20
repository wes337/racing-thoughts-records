import Splash from "@/components/splash";
import Footer from "@/components/footer";
import TopBar from "@/components/top-bar";

export default function Home() {
  return (
    <>
      <TopBar hideMenu />
      <Splash />
      <Footer hideLinks fixed />
    </>
  );
}
