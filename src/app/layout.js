import Cursor from "@/components/cursor";
import "./globals.css";

export const metadata = {
  title: "Racing Thought Records",
  description:
    "The official store for music by Joshua Hamilton. Vinyl, CD, Cassette; Lil Darkie and more.",
  openGraph: {
    images: "/images/og.jpg",
  },
  keywords: [
    "lil darkie",
    "joshua hamilton",
    "vinyl",
    "cd",
    "cassette",
    "music",
  ],
};

export const viewport = {
  themeColor: "#ededed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-blue-100 antialiased cursor-auto md:cursor-none">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
