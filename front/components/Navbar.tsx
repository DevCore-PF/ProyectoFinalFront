"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/UserContext";
import CartDropdown from "@/components/CartDropdown";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isFullyAuthenticated =
    !!user && user.isEmailVerified && user.checkBoxTerms && user.role !== null;

  return (
    <>
      {!isFullyAuthenticated ? (
        <nav className="w-full bg-navbar shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-2 text-sm">
            <div className="flex gap-2 items-center text-[1.3rem] font-medium">
              <Link
                href={"/"}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Image
                  alt="logoDev"
                  src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761576978/logoDevCorchetes_vh3ui7.webp"
                  width={500}
                  height={500}
                  className="h-8 w-8"
                />
                <span className={`hidden lg:block font-logo`}>DevCore</span>
              </Link>
            </div>

            {/* Botón menú */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden py-2 text-xl focus:outline-none transform transition-transform duration-300 ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

            {/* Enlaces desktop */}
            <div className="hidden lg:flex flex-1 justify-center space-x-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/courses", label: "Cursos" },
                { href: "/company", label: "Sobre nosotros" },
                { href: "/plans", label: "Planes" },
                { href: "/contact-us", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Botones desktop */}
            <div className="hidden lg:flex space-x-2">
              <Link
                href="/register"
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200"
              >
                Registro
              </Link>
              <Link
                href="/login"
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Menú móvil */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center space-y-3 pb-4 text-sm border-t border-gray-200 pt-4">
              {[
                { href: "/", label: "Inicio" },
                { href: "/courses", label: "Cursos" },
                { href: "/company", label: "Sobre nosotros" },
                { href: "/plans", label: "Planes" },
                { href: "/contact-us", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-background hover:text-navbar px-3 py-2 rounded-md transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="w-3/4 border-gray-300" />

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200"
              >
                Registro
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        // Navbar AUTENTICADA
        <nav className="w-full bg-navbar shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-2 text-sm">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                alt="logoDev"
                src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761576978/logoDevCorchetes_vh3ui7.webp"
                width={500}
                height={500}
                className="h-8 w-8"
              />
              <span className="text-lg font-logo">DevCore</span>
            </Link>

            {/* Botón hamburguesa */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden py-2 text-xl focus:outline-none transform transition-transform duration-300 ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

            {/* Links desktop */}
            <div className="hidden lg:flex flex-1 justify-center space-x-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/courses", label: "Cursos" },
                { href: "/company", label: "Sobre nosotros" },
                { href: "/plans", label: "Planes" },
                { href: "/contact-us", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Acciones desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              <CartDropdown />
              <Link
                href={
                  user.role === "student"
                    ? "/dashboard"
                    : user.role === "teacher"
                    ? "/teacher-dashboard"
                    : "/admin"
                }
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hover:bg-button px-3 py-2 cursor-pointer rounded-md transition-colors duration-200"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Menú móvil autenticado */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              menuOpen ? "max-h-105 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center space-y-3 pb-4 text-sm border-t border-gray-200 pt-4">
              {[
                { href: "/", label: "Inicio" },
                { href: "/courses", label: "Cursos" },
                { href: "/company", label: "Sobre nosotros" },
                { href: "/plans", label: "Planes" },
                { href: "/contact-us", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-background hover:text-navbar px-3 py-2 rounded-md transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="w-3/4 border-gray-300" />

              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="hover:bg-button p-2 rounded-md transition-colors duration-200"
              >
                Carrito
              </Link>

              <Link
                href={
                  user.role === "student"
                    ? "/dashboard"
                    : user.role === "teacher"
                    ? "/teacher-dashboard"
                    : "/admin"
                }
                onClick={() => setMenuOpen(false)}
                className="hover:bg-button p-2 rounded-md transition-colors duration-200"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="hover:bg-button p-2 cursor-pointer rounded-md transition-colors duration-200"
              >
                Log out
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
