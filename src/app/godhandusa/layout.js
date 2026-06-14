import FX from "./fx";

export const metadata = {
  title: "GODHANDUSA",
};

export const viewport = {
  themeColor: "#030303",
};

export default function GodhandUSALayout({ children }) {
  return (
    <>
      <div className="godhand-theme min-h-screen">{children}</div>
      <FX />
    </>
  );
}
