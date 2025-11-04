"use client";

import { FaCheck, FaGraduationCap } from "react-icons/fa";

const IndividualCourses = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/40 backdrop-blur-sm border border-border-light/70 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-purple-500/20 rounded-2xl mb-4">
            <FaGraduationCap className="text-accent-light text-5xl" />
          </div>
          <h3 className="text-font-light text-3xl font-bold mb-4">
            Cursos Individuales
          </h3>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Compra solo los cursos que necesitas con acceso permanente y sin
            compromisos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-700/30 rounded-xl p-6">
            <h4 className="text-font-light font-semibold text-lg mb-3">
              ¿Qué incluye?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-200 text-sm">
                <FaCheck className="text-accent-medium mt-1 flex-shrink-0" />
                <span>Acceso permanente al curso</span>
              </li>
              <li className="flex items-start gap-2 text-slate-200 text-sm">
                <FaCheck className="text-accent-medium mt-1 flex-shrink-0" />
                <span>Todos los materiales descargables</span>
              </li>
              <li className="flex items-start gap-2 text-slate-200 text-sm">
                <FaCheck className="text-accent-medium mt-1 flex-shrink-0" />
                <span>Certificado de finalización</span>
              </li>
              <li className="flex items-start gap-2 text-slate-200 text-sm">
                <FaCheck className="text-accent-medium mt-1 flex-shrink-0" />
                <span>Actualizaciones futuras gratuitas</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6">
            <h4 className="text-font-light font-semibold text-lg mb-3">
              Precios desde
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Cursos básicos</span>
                <span className="text-font-light font-semibold">
                  $19 - $39
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Cursos intermedios</span>
                <span className="text-font-light font-semibold">
                  $39 - $69
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Cursos avanzados</span>
                <span className="text-font-light font-semibold">
                  $69 - $99
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#7e4bde]/10 to-purple-500/10 border border-[#7e4bde]/30 rounded-xl p-6 mb-6">
          <p className="text-center text-slate-200 text-sm">
            Si planeas tomar 3 o más cursos, una membresía te resultará más
            económica
          </p>
        </div>

        <button className="w-full bg-button/80 hover:bg-button text-font-light font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-button/30">
          Explorar catálogo de cursos
        </button>
      </div>
    </div>
  );
};

export default IndividualCourses;