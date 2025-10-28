import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaGraduationCap, FaHandsHelping, FaLightbulb } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background2 text-gray-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-light mb-4">
            Somos DevCore: transformamos la mentalidad, impulsamos Carreras
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            El código es nuestra herramienta, pero la{" "}
            <strong>comunidad </strong> y el <strong> apoyo </strong>
            son nuestra metodología.
          </p>
        </header>

        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4 text-gray-light">
                La “chispa” que encendió DevCore ...
              </h2>
              <p className="text-gray-200 mb-4">
                DevCore nació de la frustración que sentimos con la educación
                técnica tradicional: cursos teóricos, desactualizados y
                desconectados de las demandas reales del mercado.
              </p>
              <p className="text-gray-200">
                Nuestra misión es simple: ser el “puente entre la curiosidad y
                la empleabilidad”. Creamos un ecosistema de aprendizaje
                intensivo, práctico y, sobre todo, humano, que te prepara para
                el rol de desarrollador desde el día uno.
              </p>
            </div>

            <div className="order-1 md:order-2">
              <Image
                alt="Image of developers collaborating"
                src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761496786/imagen1_kb3voz.webp" // Reemplaza con una imagen adecuada
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-20 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-light">
            Nuestra Filosofía: Código con Propósito
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-navbar p-6 rounded-lg shadow-xl border border-gray-700 hover:border-yellow-light transition-all duration-300">
              <FaLightbulb
                size={32}
                className="text-yellow-light mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">Aprender Haciendo</h3>
              <p className="text-gray-300 text-sm">
                Nuestros cursos son 80% práctica. Trabajarás en proyectos reales
                para construir un portafolio sólido y demostrar tu dominio
                técnico real.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-lg shadow-xl border border-gray-700 hover:border-yellow-light transition-all duration-300">
              <FaHandsHelping
                size={32}
                className="text-yellow-light mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">
                Comunidad Inclusiva
              </h3>
              <p className="text-gray-300 text-sm">
                Fomentamos un ambiente de apoyo constante. Nuestros mentores son
                generosos con su tiempo y conocimiento para guiarte en cada
                desafío.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-lg shadow-xl border border-gray-700 hover:border-yellow-light transition-all duration-300">
              <FaGraduationCap
                size={32}
                className="text-yellow-light mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">Dominio Avanzado</h3>
              <p className="text-gray-300 text-sm">
                Nos enfocamos en tecnologías de vanguardia para prepararte para
                el rol de Desarrollador Júnior/Intermedio con el conocimiento
                más fresco del mercado.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center pt-8 pb-10 border-t border-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-gray-100">
            ¿Listo para construir tu futuro con DevCore?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Únete a la comunidad que te da las herramientas y el soporte para
            triunfar.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/courses"
              className="bg-gray-medium-light text-navbar font-bold rounded-md px-6 py-3 text-md "
            >
              Explorar Cursos
            </Link>
            <Link
              href="/contact"
              className="bg-button text-gray-light font-bold rounded-md px-6 py-3 text-md "
            >
              Contáctanos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
