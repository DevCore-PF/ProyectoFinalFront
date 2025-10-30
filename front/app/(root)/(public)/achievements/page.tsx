<<<<<<< HEAD:front/app/(public)/achievements/page.tsx
// Next/React
import Link from "next/link";

// Icons
import {
  FaTrophy,
  FaDollarSign,
  FaCode,
  FaUsers,
  FaBookOpen,
  FaGlobe,
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaHandsHelping,
  FaBullseye,
} from "react-icons/fa";

const AchievementsPage = () => {
  return (
    <div className="min-h-screen bg-background2 text-gray-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-light mb-3">
            Nuestro Récord Inicial: Cifras que Impulsan DevCore
          </h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto">
            DevCore no es solo una plataforma, es un ecosistema de crecimiento
            comprobado para educadores y estudiantes. **A pesar de ser nuevos,
            nuestros logros hablan por sí mismos** y marcan el futuro de la
            educación en desarrollo.
          </p>
        </header>

        {/* --- */}

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-100">
            📊 Cifras Clave del Despegue (Primeros 12 Meses)
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaUsers size={24} className="text-yellow-light mx-auto mb-3" />
              <h3 className="text-4xl font-extrabold mb-1">65%</h3>
              <p className="text-sm text-gray-400">
                Estudiantes con Suscripción Activa
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaDollarSign
                size={24}
                className="text-yellow-light mx-auto mb-3"
              />
              <h3 className="text-4xl font-extrabold mb-1">$X,XXX+</h3>
              <p className="text-sm text-gray-400">
                Pagado Mensualmente a Creadores
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaBookOpen
                size={24}
                className="text-yellow-light mx-auto mb-3"
              />
              <h3 className="text-4xl font-extrabold mb-1">15,000+</h3>
              <p className="text-sm text-gray-400">Horas de Contenido Vistas</p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaCheckCircle
                size={24}
                className="text-yellow-light mx-auto mb-3"
              />
              <h3 className="text-4xl font-extrabold mb-1">92%</h3>
              <p className="text-sm text-gray-400">
                Retención Trimestral de Profesores
              </p>
            </div>
          </div>
        </section>

        {/* --- */}

        <section className="mb-20 border-t border-gray-800 pt-10">
          <h2 className="text-3xl font-bold mb-10 text-yellow-light text-center">
            Socios Clave: Confianza de Nuestros Creadores
          </h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
            Atraer a los mejores educadores fue nuestra primera misión. Sus
            logros y lealtad demuestran que DevCore es la mejor plataforma para
            la monetización del conocimiento tech.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-navbar p-6 rounded-xl border border-yellow-light/20 shadow-lg">
              <FaChartBar size={24} className="text-yellow-light mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                Crecimiento de Ingresos Pasivos
              </h3>
              <p className="text-sm text-gray-300">
                El 70% de nuestros profesores reportan que los ingresos por
                membresía son su **fuente de ingresos pasivos más estable** en
                comparación con la venta individual. **Hemos eliminado la
                incertidumbre.**
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-yellow-light/20 shadow-lg">
              <FaTrophy size={24} className="text-yellow-light mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                Reconocimiento de Expertos (NUEVO)
              </h3>
              <p className="text-sm text-gray-300">
                Ya contamos con 12 profesores reconocidos como líderes en su
                industria, elegidos por nuestro equipo por su calidad y
                trayectoria.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-yellow-light/20 shadow-lg">
              <FaCode size={24} className="text-yellow-light mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                Adopción de Tecnologías
              </h3>
              <p className="text-sm text-gray-300">
                Hemos logrado una biblioteca diversa, con cobertura en más de 15
                lenguajes de programación y frameworks, desde Python/Django
                hasta Rust, asegurando relevancia total.
              </p>
            </div>
          </div>
        </section>

        {/* --- */}

        <section className="mb-20 border-t border-gray-800 pt-10">
          <h2 className="text-3xl font-bold mb-10 text-yellow-light text-center">
            Transformando el Aprendizaje: Impacto Comunitario
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-2xl font-semibold mb-5 text-gray-100 flex items-center">
                <FaBullseye className="mr-3 text-yellow-light" /> Hitos de
                Enfoque y Calidad
              </h3>
              <ul className="space-y-4 text-base text-gray-300 list-none pl-0">
                <li className="flex items-start">
                  <span className="text-yellow-light mr-3 mt-1">✓</span> Soporte
                  Ágil (NUEVO): El 85% de las consultas de los estudiantes son
                  resueltas en la primera hora por la comunidad y los creadores.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-light mr-3 mt-1">✓</span> **Alta
                  Satisfacción en 12 Meses:** Más del 60% de los suscriptores de
                  la membresía anual la han renovado, demostrando lealtad y
                  valor.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-light mr-3 mt-1">✓</span>{" "}
                  Diversidad Geográfica: Estudiantes y profesores de más de 20
                  países de habla hispana, creando una red global de
                  oportunidades.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-5 text-gray-100 flex items-center">
                <FaGraduationCap className="mr-3 text-yellow-light" /> Historias
                de Éxito
              </h3>
              <blockquote className="bg-navbar p-5 rounded-xl border border-gray-700 text-base italic shadow-lg">
                “En seis meses con la membresía, he completado tres bootcamps
                parciales y he cambiado mi stack principal. El valor es
                inigualable. Me ayudó a obtener un aumento de sueldo.”
                <p className="mt-3 font-semibold text-yellow-light text-sm">
                  — Luis R., Suscriptor de 6 Meses (Backend Dev)
                </p>
              </blockquote>
              <blockquote className="bg-navbar p-5 rounded-xl border border-gray-700 text-base italic shadow-lg">
                “La calidad de producción que DevCore ofrece para mis videos me
                posicionó como un líder de opinión en mi nicho. Es un verdadero
                socio, no solo una plataforma. Siento un apoyo real.”
                <p className="mt-3 font-semibold text-yellow-light text-sm">
                  — Dra. Elena S., Profesora con dos cursos Top-Tier
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* --- */}

        <section className="mb-20 border-t border-gray-800 pt-10">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-100">
            ⏳ Nuestro Compromiso: Inversión en Crecimiento
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaHandsHelping
                size={32}
                className="text-yellow-light mx-auto mb-3"
              />
              <h3 className="text-4xl font-extrabold mb-1">50%</h3>
              <p className="text-sm text-gray-400">
                De las ganancias reinvertidas en calidad de video y audio.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaClock size={32} className="text-yellow-light mx-auto mb-3" />
              <h3 className="text-4xl font-extrabold mb-1">4 Horas</h3>
              <p className="text-sm text-gray-400">
                Tiempo promedio de respuesta para consultas de profesores.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light/30 transition-colors">
              <FaChartBar
                size={32}
                className="text-yellow-light mx-auto mb-3"
              />
              <h3 className="text-4xl font-extrabold mb-1">20%</h3>
              <p className="text-sm text-gray-400">
                Crecimiento promedio de nuevos usuarios cada mes.
              </p>
            </div>
          </div>
        </section>

        {/* --- */}

        <section className="mb-16 border-t border-gray-800 pt-10">
          <h2 className="text-3xl font-bold mb-8 text-yellow-light text-center flex items-center justify-center">
            <FaGlobe className="mr-3" /> Próximos Logros en el Horizonte
            (Roadmap)
          </h2>
          <p className="text-base text-gray-300 max-w-4xl mx-auto mb-8 text-center">
            Nuestro crecimiento es una promesa continua. Estos son los hitos que
            buscamos alcanzar en el próximo año fiscal, y tú puedes ser parte de
            ellos. Estamos construyendo este récord juntos.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-navbar/50 rounded-lg border border-yellow-light/20 shadow-md">
              <h4 className="text-lg font-semibold text-gray-100">
                Meta Q1: Expansión Curricular
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                Incorporar más de 30 cursos nuevos en áreas emergentes (IA, Web3
                y DevOps) para mantenernos a la vanguardia.
              </p>
            </div>

            <div className="p-4 bg-navbar/50 rounded-lg border border-yellow-light/20 shadow-md">
              <h4 className="text-lg font-semibold text-gray-100">
                Meta Q2: Programa de Mentores 1:1
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                Lanzar un programa de tutorías 1:1 pagado para creadores de
                contenido premium y sus alumnos.
              </p>
            </div>

            <div className="p-4 bg-navbar/50 rounded-lg border border-yellow-light/20 shadow-md">
              <h4 className="text-lg font-semibold text-gray-100">
                Meta Q3: Presencia Local
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                Organizar el primer evento presencial de networking (DevCore
                Summit) para profesores y alumnos en una capital importante.
              </p>
            </div>
          </div>
        </section>

        {/* --- */}

        <section className="text-center pt-10 border-t border-gray-800">
          <h3 className="text-3xl font-bold mb-4 text-gray-100">
            ¿Listo para sumar tu propio logro a la lista?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a la plataforma que está redefiniendo el aprendizaje y la
            monetización en el mundo del desarrollo web y el software.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/plans"
              className="bg-navbar border border-font-light/10 text-font-light font-bold rounded-md px-8 py-3 text-md  hover:bg-button transition-colors duration-100"
            >
              Comprar una Membresía Hoy
            </Link>
            <Link
              href="/register"
              className="bg-navbar border border-font-light/10 text-font-light font-bold rounded-md px-8 py-3 text-md hover:bg-button transition-colors duration-100"
            >
              Conviértete en Creador
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
=======
import UnderConstruction from "@/components/UnderConstruction";
import React from "react";

const AchievementsPage = () => {
return <UnderConstruction />;
>>>>>>> origin/dev:front/app/(root)/(public)/achievements/page.tsx
};

export default AchievementsPage;
