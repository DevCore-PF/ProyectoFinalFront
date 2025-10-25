"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-navbar shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-2 text-sm font-bold">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg">DevCore</span>
        </div>

        {/* Botón hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden py-2 text-lg focus:outline-none transform transition-transform duration-300 ${
            menuOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Links escritorio */}
        <div className="hidden md:flex flex-1 justify-center space-x-2">
          <Link
            href="/"
            className="hover:bg-yellow-light hover:text-navbar p-3 rounded-md transition-colors duration-200"
          >
            Inicio
          </Link>
          <Link
            href="/courses"
            className="hover:bg-yellow-light hover:text-navbar p-3 rounded-md transition-colors duration-200"
          >
            Cursos
          </Link>
          <Link
            href="/aboutus"
            className="hover:bg-yellow-light hover:text-navbar p-3 rounded-md transition-colors duration-200"
          >
            Sobre nosotros
          </Link>
          <Link
            href="/plans"
            className="hover:bg-yellow-light hover:text-navbar p-3 rounded-md transition-colors duration-200"
          >
            Planes
          </Link>
          <Link
            href="/contact"
            className="hover:bg-yellow-light hover:text-navbar p-3 rounded-md transition-colors duration-200"
          >
            Contacto
          </Link>
        </div>

        {/* Botones escritorio */}
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

      {/* Menú hamburguesa */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-4 pb-4 text-sm font-bold border-t border-gray-200 pt-4">
          {[
            { href: "/", label: "Inicio" },
            { href: "/courses", label: "Cursos" },
            { href: "/aboutus", label: "Sobre nosotros" },
            { href: "/plans", label: "Planes" },
            { href: "/contact", label: "Contacto" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="hover:bg-yellow-light hover:text-navbar px-3 py-2 rounded-md transition-colors duration-200 inline-block"
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
  );
}
