import Cursor from "@/components/cursor";
import "./globals.css";

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
      <body className="flex flex-col bg-blue-100 antialiased cursor-auto md:cursor-none">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
