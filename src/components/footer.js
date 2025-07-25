import Image from "next/image";
import Link from "next/link";
import { CDN_URL } from "@/utils";

export default function Footer({ fixed, hideLinks }) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-[64px] z-1 ${
        fixed ? "fixed bottom-0 left-0" : "mt-auto"
      }`}
    >
      {!hideLinks && (
        <div className="flex gap-10 font-sans font-medium text-sm">
          <Link className="opacity-75 hover:opacity-100" href="/privacy">
            Privacy
          </Link>
          <Link className="opacity-75 hover:opacity-100" href="/terms">
            Terms
          </Link>
        </div>
      )}
      <div className="h-[16px] md:h-[24px]">
        <Image
          className="w-full h-full object-contain select-none"
          src={`${CDN_URL}/images/copy.png`}
          alt="Copyright Racing Thought Records."
          width={1450}
          height={72}
        />
      </div>
    </div>
  );
}
