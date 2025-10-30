"use client";

// Next/React
import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

// Icons
import { TbMailFilled } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const rutaDestino = "/";

  const handleInicioClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (currentPath === rutaDestino) {
      e.preventDefault();

      const targetElement = document.getElementById("item");
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      e.preventDefault();
      router.push("/#item");
    }
  };

  return (
    <>
      <div className="flex flex-col bg-footer pb-5">
        <div className=" flex flex-row justify-between px-20 pt-15 bg-footer flex-wrap gap-10">
          {/* Este es el contenedor q divide la seccion de las columnas en 2  */}

          <div className="flex flex-col text-gray-dark text-[12px] gap-3">
            {/* Contenedor izquierdo */}
            <div className="flex flex-row items-center gap-1">
              {" "}
              <TbMailFilled size={16} />
              <p>devcoreacademia@gmail.com</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaPhoneAlt size={14} />
              <p>+54 9 3329 31-6013</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaLocationDot size={14} />
              <p>La Violeta, Provincia de Buenos Aires, Argentina</p>
            </div>
          </div>

          <div className="flex flex-row gap-20 flex-wrap">
            {/* contenedor derecho */}
            <div className="flex flex-col text-[#ABA5B6] gap-2 text-[12px] font-normal">
              {/* columna izq-der */}

              <Link href="/#item" onClick={handleInicioClick}>
                <p className="text-white font-semibold text-sm hover:text-shadow-xs text-shadow-white">
                  Inicio
                </p>
              </Link>

              <Link
                href="/benefits"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                Beneficios
              </Link>
              <Link
                href="/our-courses"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                Nuestros Cursos
              </Link>
              <Link
                href="/testimonials"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                Testimonios
              </Link>
              <Link
                href="/faq"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                Preguntas Frecuentes
              </Link>
            </div>
            <div className="flex flex-col text-gray-dark gap-2 text-[12px] font-normal">
              {/* columna cntr-der */}
              <Link href="/about-us">
                <p className="text-white font-semibold text-sm hover:text-shadow-xs text-shadow-white">
                  Sobre Nosotros
                </p>
              </Link>

              <Link
                href="/company"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                La Empresa
              </Link>
              <Link
                href="/achievements"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                Logros
              </Link>
              <Link
                href="/our-goals"
                className="text-[#ABA5B6] hover:text-white focus:text-[#ABA5B6] active:text-[#ABA5B6] transition-colors duration-200"
              >
                Nuestras metas
              </Link>
            </div>
            <div>
              {/* columna der-der */}
              <p className="text-white font-semibold text-sm">Redes Sociales</p>
              <div className="flex flex-row justify-around pt-3">
                <Link target="_blank" href="https://www.facebook.com">
                  <BsFacebook />
                </Link>
                <Link target="_blank" href="https://www.x.com">
                  <BsTwitterX />
                </Link>
                <Link target="_blank" href="https://www.linkedin.com">
                  <FaLinkedin />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-10 pt-8 px-20">
          <hr className="border border-t-0 h-px border-gray-dark" />
        </div>
      </div>
    </>
  );
};

export default Footer;
