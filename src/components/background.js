import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed w-full h-full z-0 pointer-events-none">
      <Image
        src={`/textures/natural-paper.png`}
        alt=""
        width={523}
        height={384}
      />
    </div>
  );
}
