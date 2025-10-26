import { IoFlashSharp } from "react-icons/io5";
import Image from "next/image";

const CreativityBadge = () => {
  return (
    <div className="relative inline-flex">
      <Image
        src={"/icons/Lines.svg"}
        width={36}
        height={25}
        alt="Decorative lines"
        className="absolute -left-7 -top-7 z-10"
      />
      <div className="relative inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 bg-font-light backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-accent-medium rounded shrink-0">
          <IoFlashSharp className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
        </div>
        <span className="font-title text-gray-800 font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight">
          <span className="text-button">Potencia</span> tu creatividad
        </span>
      </div>
    </div>
  );
};

export default CreativityBadge;
