"use client";
//Next
import Link from "next/link";
import Image from "next/image";
//Icons
import { IoFlashSharp } from "react-icons/io5";

const CreativityBadge = () => {
  return (
    <>
      <div className="flex justify-center mb-3 sm:mb-8 pt-8 lg:pt-12">
        <div className="relative inline-flex">
          <Image
            src="/icons/Lines.svg"
            width={36}
            height={25}
            alt="Decorative lines"
            className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 lg:-left-7 lg:-top-7 z-10 w-6 h-auto sm:w-8 lg:w-9"
          />
          <div className="relative inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-slate-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border-light/40 shadow-lg hover:border-slate-600/50 transition-all duration-300 hover:shadow-button/20">
            <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-accent-medium rounded shrink-0">
              <IoFlashSharp className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <span className="font-title text-font-light font-semibold text-lg md:text-3xl lg:text-6xl leading-tight whitespace-nowrap">
              <span className="text-button/90">Potencia</span> tu creatividad
            </span>
          </div>
        </div>
      </div>

      <div className="text-center mb-7 sm:mb-20">
        <h1 className="text-font-light leading-[150%] text-center tracking-normal font-medium text-2xl sm:text-3xl lg:text-5xl px-4 mb-4">
          Con formación online en diseño y desarrollo
        </h1>

        <p className="text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto text-center font-normal font-body text-base sm:text-lg lg:text-xl px-4">
          Aprende con expertos de la industria y lleva tus habilidades al
          siguiente nivel
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 w-full sm:w-auto px-4 max-w-md sm:max-w-none mx-auto">
          <Link
            href="#courses"
            className="px-6 sm:px-8 py-3 bg-button/90 hover:bg-button text-font-light font-semibold rounded-lg transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95"
          >
            Explorar cursos
          </Link>
          <Link
            href="#pricing"
            className="px-6 sm:px-8 py-3 bg-font-light text-font-dark/80 text-sm md:text-base hover:bg-gray-100 hover:text-button font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg"
          >
            Ver Planes
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreativityBadge;
