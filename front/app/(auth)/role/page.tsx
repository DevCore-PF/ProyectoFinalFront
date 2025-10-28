"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Icons
import { GoMortarBoard } from "react-icons/go";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
// Next
import Link from "next/link";

import { selectUserRole } from "@/services/user.services";

const SelectRolePage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Error: No hay token de autenticación. Por favor, inicia sesión.");
      setIsLoading(false);
      router.push("/login");
      return;
    }

    try {
      const success = await selectUserRole(selectedRole, token);

      if (success) {
        alert(
          `Rol '${selectedRole}' guardado con éxito. Por favor, inicia sesión.`
        );
        router.push("/login");
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const baseCardClasses =
    "shrink-0 flex flex-col gap-10 border-2 rounded-[10px] duration-300 transition-all cursor-pointer p-12 sm:p-20";
  const unselectedClasses =
    "border-border bg-background2/50 hover:scale-105 hover:shadow-[0_0_10px_#474b8a] hover:brightness-110";
  const selectedClasses =
    "border-[#474b8a] scale-105 shadow-[0_0_20px_#474b8a] bg-background2 brightness-120";

  return (
    <div className="min-h-screen text-font-light flex flex-col">
      <header className="p-4">
        <Link href="/">
          <span className="font-semibold">LOGO</span>
        </Link>
      </header>

      <section className="flex flex-col items-center justify-center mt-15 px-4 flex-1">
        <h1 className="text-2xl sm:text-4xl text-center">
          Bienvenid@ a DevCore.
        </h1>
        <h3 className="text-2xl sm:text-3xl mt-3 text-center">
          Elegí tu perfil:
        </h3>

        <div className="flex flex-wrap justify-center gap-8 mt-10 mb-16">
          <span
            className={`${baseCardClasses} ${
              selectedRole === "TEACHER" ? selectedClasses : unselectedClasses
            }`}
            onClick={() => handleRoleSelect("TEACHER")}
          >
            <GoMortarBoard
              className="text-[#bfc1de] w-full h-auto max-w-[150px] sm:max-w-[250px]"
              size={250}
            />
            <p className="text-3xl sm:text-5xl text-center">Profesor</p>
          </span>

          <span
            className={`${baseCardClasses} ${
              selectedRole === "STUDENT" ? selectedClasses : unselectedClasses
            }`}
            onClick={() => handleRoleSelect("STUDENT")}
          >
            <HiOutlineComputerDesktop
              className="text-[#bfc1de] w-full h-auto max-w-[150px] sm:max-w-[250px]"
              size={250}
            />
            <p className="text-3xl sm:text-5xl text-center">Alumn@</p>
          </span>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className={`px-5 py-2 rounded-xl mb-10 transition-all duration-150 text-lg sm:text-xl font-light 
            ${
              selectedRole && !isLoading
                ? "border-font-light hover:scale-103 cursor-pointer bg-blue-600 text-white"
                : "border-gray-500 text-gray-500 cursor-not-allowed opacity-50"
            }`}
        >
          {isLoading ? "Guardando..." : "Continuar"}
        </button>
      </section>
    </div>
  );
};

export default SelectRolePage;
