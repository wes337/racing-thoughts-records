import Link from "next/link";
import Image from "next/image";
import { COLLECTION_IDS } from "@/utils";
import Eye from "@/components/eye";
import MobileMenu from "@/components/mobile-menu";
import Cart from "@/components/cart";

export default function TopBar({ hideMenu }) {
  if (hideMenu) {
    return (
      <div className="sticky top-0 left-0 flex justify-center items-center w-full h-[64px] md:h-[72px] 2xl:h-[96px] z-2">
        <div className="h-[40px] md:h-[48px]">
          <Eye />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 left-0 flex items-center w-full h-[64px] md:h-[72px] 2xl:h-[96px] z-2">
      <div className="top-bar-bg w-full h-full bg-white" />
      <MobileMenu />
      <div className="flex items-center justify-center gap-8 absolute left-[50%] translate-x-[-50%] h-[40px] md:h-[48px] w-full">
        <div className="hidden md:flex h-full w-[33%] justify-end gap-8">
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
            href={`/collections/${COLLECTION_IDS.CDS}`}
          >
            <Image
              className="w-auto h-full object-contain"
              src={`/images/cds.png`}
              alt="CDs"
              width={628}
              height={212}
            />
          </Link>
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
            href={`/collections/${COLLECTION_IDS.VINYL}`}
          >
            <Image
              className="w-auto h-full object-contain"
              src={`/images/vinyl.png`}
              alt="Vinyl"
              width={816}
              height={207}
            />
          </Link>
        </div>
        <Eye />
        <div className="hidden md:flex h-full w-[33%] justify-start gap-8">
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
            href={`/collections/${COLLECTION_IDS.CASSETTES}`}
          >
            <Image
              className="w-auto h-full object-contain"
              src={`/images/cassettes.png`}
              alt="Cassettes"
              width={1223}
              height={187}
            />
          </Link>
          <Link
            className="flex items-center justify-center w-auto p-2 opacity-90 hover:scale-[1.1] hover:opacity-100 hover:brightness-75"
            href={`/collections/${COLLECTION_IDS.OTHER}`}
          >
            <Image
              className="w-auto h-full object-contain"
              src={`/images/other.png`}
              alt="Other"
              width={1170}
              height={235}
            />
          </Link>
        </div>
      </div>
      <Cart />
    </div>
  );
}
