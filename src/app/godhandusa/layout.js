import FX from "./fx";

export const metadata = {
  title: "GODHANDUSA",
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
