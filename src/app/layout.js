import { Geist, Martian_Mono } from "next/font/google";
import Cursor from "@/components/cursor";
import "./globals.css";

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Racing Thought Records",
  description: "Vinyl records, CDs, and cassettes.",
};

export const viewport = {
  themeColor: "#ededed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${martianMono.className} antialiased cursor-auto md:cursor-none`}
      >
        <Cursor />
        {children}
      </body>
    </html>
  );
}
