import Image from "next/image";
import Link from "next/link";
import { CDN_URL } from "@/utils";

const LINKS = [
  { label: "Privacy", href: "/policies/privacy-policy" },
  { label: "Refunds", href: "/policies/refund-policy" },
  { label: "Terms", href: "/policies/terms-of-service" },
  { label: "Shipping", href: "/policies/shipping-policy" },
];

export default function Footer({ fixed, hideLinks }) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-[64px] z-1 ${
        fixed ? "fixed bottom-0 left-0" : "mt-auto"
      }`}
    >
      {!hideLinks && (
        <div className="flex gap-8 font-sans font-medium text-xs md:text-sm tracking-tighter mb-2">
          {LINKS.map(({ label, href }) => {
            return (
              <Link
                key={label}
                className="opacity-75 hover:opacity-100"
                href={href}
              >
                {label}
              </Link>
            );
          })}
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
