import Cursor from "@/components/cursor";

export const viewport = {
  themeColor: "#ededed",
};

export default function DefaultLayout({ children }) {
  return (
    <div className="default-theme flex min-h-dvh flex-col antialiased cursor-auto md:cursor-none">
      <Cursor />
      {children}
    </div>
  );
}
