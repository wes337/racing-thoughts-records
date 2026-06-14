import Splash from "@/components/splash";
import Footer from "@/components/footer";
import TopBar from "@/components/top-bar";

export default function HomePage() {
  return (
    <>
      <TopBar hideMenu />
      <Splash showCountdown />
      <Footer hideLinks />
    </>
  );
}
