import FX from "./fx";
import { SITE_NAME, pageMetadata } from "@/metadata";

export const metadata = {
  ...pageMetadata({
    title: "GODHANDUSA",
    description: "Official GODHANDUSA merch, sold by Racing Thoughts Records.",
    path: "/godhandusa",
  }),
  // A layout that sets a title drops the root template for its children, so
  // restate it here for the product pages.
  title: { default: "GODHANDUSA", template: `%s | ${SITE_NAME}` },
};

export const viewport = {
  themeColor: "#ededed",
};

export default function GodhandUSALayout({ children }) {
  return (
    <>
      <div className="godhand-theme min-h-screen">{children}</div>
      <FX />
    </>
  );
}
