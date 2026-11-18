import Splash from "@/components/splash";
import Footer from "@/components/footer";
import TopBar from "@/components/top-bar";

export const metadata = { robots: { index: false } };

export default function HomePage() {
  return (
    <>
      <TopBar hideMenu />
      <Splash showCountdown />
      <Footer hideLinks />
    </>
  );
}
