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
      <section className="flex gap-4 flex-col items-center justify-center mt-15">
        <h1 className="text-5xl">Bienvenid@ a DevCore!</h1>
        <h3 className="text-4xl">¿Qué eres?</h3>
        <div className="flex min-w-280  mt-15 mb-20 justify-between ">
          <span className="border-2 border-border bg-background2/50 p-25 rounded-[10px] duration-300 transition-all hover:scale-110 cursor-pointer">
            <GoMortarBoard className="text-[#bfc1de]" size={300} />
            <p>Profesor</p>
          </span>
          <span className="border-2  border-border bg-background2/50 p-25 rounded-[10px] duration-300 transition-all hover:scale-110 cursor-pointer">
            <HiOutlineComputerDesktop className="text-[#bfc1de]" size={300} />
          <p>Alumn@</p>
          </span>
        </div>
      </section>
    </div>
  );
};

export default page;
