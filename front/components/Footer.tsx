import { TbMailFilled } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
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
              <p>correo@electronico.com</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaPhoneAlt size={14} />
              <p>+1 765 889 9540</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaLocationDot size={14} />
              <p>ubicacion</p>
            </div>
          </div>

          <div className="flex flex-row gap-20 flex-wrap">
            {/* contenedor derecho */}
            <div className="flex flex-col text-[#ABA5B6] gap-2 text-[12px] font-normal">
              {/* columna izq-der */}
              <p className="text-white font-semibold text-sm">Inicio</p>
              <Link href="/">Beneficios</Link>
              <Link href="/">Nuestros Cursos</Link>
              <Link href="/">Testimonios</Link>
              <Link href="/">Preguntas Frecuentes</Link>
            </div>
            <div className="flex flex-col text-[#ABA5B6] gap-2 text-[12px] font-normal">
              {/* columna cntr-der */}
              <p className="text-white font-semibold text-sm">Sobre Nosotros</p>

              <Link href="/">La Empresa</Link>
              <Link href="/">Logros</Link>
              <Link href="/">Nuestras metas</Link>
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
