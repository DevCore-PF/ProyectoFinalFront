//Icons
import { GoMortarBoard } from "react-icons/go";
import { HiOutlineComputerDesktop } from "react-icons/hi2";

//Next
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen text-font-light flex flex-col">
      <header className="p-4">
        <Link href="/">
          <span className="font-semibold">LOGO</span>
        </Link>
      </header>

      <section className="flex flex-col items-center justify-center mt-15 px-4">
        <h1 className="text-2xl sm:text-4xl text-center">Bienvenid@ a DevCore.</h1>
        <h3 className="text-2xl sm:text-3xl mt-3 text-center">Elegí tu perfil:</h3>

        <div className="flex flex-wrap justify-center gap-8 mt-10 mb-20">
          <span className="shrink-0 flex flex-col gap-10 border-2 border-border bg-background2/50 p-12 sm:p-20 rounded-[10px] duration-300 transition-all hover:scale-105 cursor-pointer hover:shadow-[0_0_10px_#474b8a] hover:brightness-110">
            <GoMortarBoard
              className="text-[#bfc1de] w-full h-auto max-w-[150px] sm:max-w-[250px]"
              size={250}
            />
            <p className="text-3xl sm:text-5xl text-center">Profesor</p>
          </span>

          <span className="shrink-0 flex flex-col gap-10 border-2 border-border bg-background2/50 p-12 sm:p-20 rounded-[10px] duration-300 transition-all hover:scale-105 cursor-pointer hover:shadow-[0_0_10px_#474b8a] hover:brightness-110">
            <HiOutlineComputerDesktop
              className="text-[#bfc1de] w-full h-auto max-w-[150px] sm:max-w-[250px]"
              size={250}
            />
            <p className="text-3xl sm:text-5xl text-center">Alumn@</p>
          </span>
        </div>

        <button className="px-5 py-2 border border-font-light rounded-xl mb-10 hover:scale-103 transition-all duration-150 cursor-pointer text-lg sm:text-xl font-light">
          Continuar
        </button>
      </section>
    </div>
  );
};

export default page;
