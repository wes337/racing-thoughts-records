"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ARTISTS = [
  { id: "lildarkie", label: "Lil Darkie", href: "/shop" },
  { id: "godhandusa", label: "GODHANDUSA", href: "/godhandusa" },
];

export default function ArtistSwitcher() {
  const pathname = usePathname();

  const selectedArtist = useMemo(() => {
    return ARTISTS.find((artist) => pathname.includes(artist.id)) || ARTISTS[0];
  }, [pathname]);

  return (
    <div className="artist-switcher flex flex-col gap-2 mt-5 md:mt-8">
      <div className="flex items-center justify-center gap-10">
        {ARTISTS.map((artist) => {
          return (
            <Link
              key={artist.id}
              className="group relative h-[48px] md:h-[80px] cursor-pointer opacity-75 hover:opacity-100 focus:opacity-100 hover:rotate-3 focus:rotate-3"
              href={artist.href}
            >
              <img
                className="h-full w-auto object-contain opacity-100 group-hover:opacity-0 group-focus:opacity-0 pointer-events-none"
                src={`/images/artists/${artist.id}${selectedArtist.id === artist.id ? "-red" : ""}.png`}
                alt={artist.label}
              />
              <img
                className="absolute top-0 left-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none"
                src={`/images/artists/${artist.id}-red.png`}
                alt={artist.label}
              />
            </Link>
          );
        })}
      </div>
      <div className="h-[12px] md:h-[16px] w-auto m-auto mt-5 mb-5 md:mb-0 opacity-75">
        <img className="h-full w-auto" src={`/images/line.png`} alt="" />
      </div>
    </div>
  );
}
