"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/UserContext";
import CartDropdown from "@/components/CartDropdown";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  // aca
  const isAuthenticated = !!user?.role;

  return (
    <>
      {!isAuthenticated ? (
        <nav className="w-full bg-navbar shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-2 text-sm font-bold">
            <div className="flex gap-2 items-center text-[1.3rem]  font-medium  ">
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
                <span
                  className={`hidden lg:block font-logo`}
                >
                  DevCore
                </span>
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden py-2 text-lg focus:outline-none transform transition-transform duration-300 ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

            <div className="hidden md:flex flex-1 justify-center space-x-2">
              <Link
                href="/"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Inicio
              </Link>
              <Link
                href="/courses"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Cursos
              </Link>
              <Link
                href="/company"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Sobre nosotros
              </Link>
              <Link
                href="/plans"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Planes
              </Link>
              <Link
                href="/contact-us"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Contacto
              </Link>
            </div>

            <div className="hidden md:flex space-x-1">
              <Link
                href="/register"
                className="hover:bg-button p-3 rounded-md transition-colors duration-200"
              >
                Registro
              </Link>
              <Link
                href="/login"
                className="hover:bg-button p-3 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center space-y-4 pb-4 text-sm font-bold border-t border-gray-200 pt-4">
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
                  className="hover:bg-background hover:text-navbar px-3 py-2 rounded-md transition-colors duration-200 inline-block"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="w-3/4 border-gray-300" />

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200 inline-block"
              >
                Registro
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:bg-button px-3 py-2 rounded-md transition-colors duration-200 inline-block"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="w-full bg-navbar shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-2 text-sm font-bold">
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
              <span className="font-bold text-lg font-logo">DevCore</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden py-2 text-lg focus:outline-none transform transition-transform duration-300 ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

            <div className="hidden md:flex flex-1 justify-center space-x-2">
              <Link
                href="/"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Inicio
              </Link>
              <Link
                href="/courses"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Cursos
              </Link>
              <Link
                href="/company"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Sobre nosotros
              </Link>
              <Link
                href="/plans"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Planes
              </Link>
              <Link
                href="/contact-us"
                className="hover:bg-background hover:text-font-light p-3 rounded-md transition-colors duration-200"
              >
                Contacto
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <CartDropdown />

              {user?.role && (
                <Link
                  href={
                    user.role === "student"
                      ? "/dashboard"
                      : user.role === "teacher"
                      ? "/teacher-dashboard"
                      : "/admin-dashboard"
                  }
                  className="hover:bg-button p-3 rounded-md transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="hover:bg-button p-3 rounded-md cursor-pointer transition-colors duration-200"
              >
                Log out
              </button>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              menuOpen ? "max-h-105 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center space-y-4 pb-4 text-sm font-bold border-t border-gray-200 pt-4">
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
                  className="hover:background hover:text-navbar px-3 py-2 rounded-md transition-colors duration-200 inline-block"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="w-3/4 border-gray-300" />

              {user?.role && (
                <Link
                  href={
                    user.role === "student"
                      ? "/dashboard"
                      : user.role === "teacher"
                      ? "/teacher-dashboard"
                      : "/admin-dashboard"
                  }
                  className="hover:bg-button p-3 rounded-md transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="hover:bg-button p-2 rounded-md transition-colors duration-200"
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
