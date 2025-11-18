//Next/React
import Link from "next/link";
import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-950 to-slate-900 text-gray-100 p-4 sm:p-8 text-center">
      <div className="mb-8">
        <Image
          src="https://res.cloudinary.com/dclx6hdpk/image/upload/v1762290639/logo2_gxkhlq.png"
          alt="DevCore Logo"
          width={100}
          height={100}
          className="rounded-xl border border-button/50 p-2"
        />
      </div>

      <h1 className="text-7xl sm:text-9xl font-extrabold text-accent-medium drop-shadow-lg mb-4">
        404
      </h1>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-light mb-6">
        Página No Encontrada
      </h2>
      <p className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto mb-10">
        Parece que la página que estás buscando ha tomado un camino diferente.
        ¡No te preocupes! Te ayudaremos a ir de regreso a nuestra página de
        Inicio.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-3 rounded-md font-bold text-lg
                   bg-navbar/50 text-white border border-font-light/10 
                   hover:bg-button 
                   transition-all duration-300 shadow-lg"
      >
        Volver a Inicio
      </Link>

      <p className="mt-20 text-sm text-gray-500">
        Si crees que esto es un error,{" "}
        <Link href="/contact-us" className="text-accent-medium hover:underline">
          contáctanos
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFoundPage;
