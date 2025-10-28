"use client";
import { useState, useEffect } from "react";
import { IoFlashSharp } from "react-icons/io5";

const CreativityBadge = () => {
  // const words = ["creatividad", "futuro", "carrera", ""];
  // const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  // const [isDeleting, setIsDeleting] = useState(false);

  // useEffect(() => {
  //   const currentWord = words[currentWordIndex];
  //   const typingSpeed = isDeleting ? 50 : 100;
  //   const pauseTime = isDeleting ? 500 : 2000;

  //   const timeout = setTimeout(() => {
  //     if (!isDeleting && currentText === currentWord) {
  //       setTimeout(() => setIsDeleting(true), pauseTime);
  //     } else if (isDeleting && currentText === "") {
  //       setIsDeleting(false);
  //       setCurrentWordIndex((prev) => (prev + 1) % words.length);
  //     } else {
  //       setCurrentText(
  //         isDeleting
  //           ? currentWord.substring(0, currentText.length - 1)
  //           : currentWord.substring(0, currentText.length + 1)
  //       );
  //     }
  //   }, typingSpeed);

  //   return () => clearTimeout(timeout);
  // }, [currentText, isDeleting, currentWordIndex]);

  return (
    <div className="relative inline-flex">
      {/* <svg
        width="36"
        height="25"
        viewBox="0 0 36 25"
        fill="none"
        className="absolute -left-7 -top-7 z-10"
      >
        <path d="M2 2L10 10M2 10L10 2M26 15L34 23M26 23L34 15" stroke="#7e4bde" strokeWidth="3" strokeLinecap="round"/>
      </svg> */}

      {/* <Image
        src={"/icons/Lines.svg"}
        width={36}
        height={25}
        alt="Decorative lines"
        className="absolute -left-7 -top-7 z-10"
      /> */}
      <div className="relative inline-flex w-fit items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg hover:border-slate-600/50 transition-all duration-300">
        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-button/20 rounded shrink-0">
          <IoFlashSharp className="text-button w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
        </div>
        <span className="font-title text-font-light font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight">
          <span className="text-button">Potencia</span> tu{" "}
          <span className="inline-block text-left">
            futuro
            {/* <span className="animate-pulse text-button">|</span> */}
          </span>
        </span>
      </div>
    </div>
  );
};

export default CreativityBadge;

// import { IoFlashSharp } from "react-icons/io5";
// import Image from "next/image";

// const CreativityBadge = () => {
//   return (
//     <div className="relative inline-flex">
//       <Image
//         src={"/icons/Lines.svg"}
//         width={36}
//         height={25}
//         alt="Decorative lines"
//         className="absolute -left-7 -top-7 z-10"
//       />
//       <div className="relative inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 bg-font-light backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
//         <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-accent-medium rounded shrink-0">
//           <IoFlashSharp className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
//         </div>
//         <span className="font-title text-gray-800 font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight">
//           <span className="text-button">Potencia</span> tu creatividad
//         </span>
//       </div>
//     </div>
//   );
// };

// export default CreativityBadge;
