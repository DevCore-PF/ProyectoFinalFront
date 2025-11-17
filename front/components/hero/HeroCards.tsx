"use client";

import {
  FaGraduationCap,
  FaInfinity,
  FaCode,
  FaRocket,
  FaCertificate,
} from "react-icons/fa";

const HeroCards = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-background2/30 rounded-2xl blur-xl group-hover:bg-background2/40 transition-all duration-500"></div>
          <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-button/50 transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-button/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaInfinity className="text-accent-light text-3xl" />
                </div>
                <h3 className="text-font-light font-semibold text-2xl">
                  Membresías
                </h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Acceso ilimitado a todos los cursos. Aprende sin límites y
                mantente actualizado con contenido nuevo cada semana.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
                  1 mes
                </span>
                <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
                  3 meses
                </span>
                <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
                  Anual
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-background2/30 rounded-2xl blur-xl group-hover:bg-background2/40 transition-all duration-500"></div>
          <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaGraduationCap className="text-accent-light text-3xl" />
                </div>
                <h3 className="text-font-light font-semibold text-2xl">
                  Cursos Individuales
                </h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Elige y paga solo por lo que necesitas. Acceso permanente y
                actualizaciones gratuitas de por vida.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Desde $19</span>
                  <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300 text-xs">
                    Acceso permanente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-linear-to-r from-button/10 to-purple-500/10 border border-border-light/30 rounded-xl p-3 hover:border-button/40 transition-all duration-300">
            <p className="text-yellow-200/90 font-mono font-semibold text-sm lg:text-base text-center">
              <span className="font-title">&lt;</span> Tu próxima lección al
              alcance de tu mano{" "}
              <span className="font-title">
                /<span>&gt;</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
          <div className="absolute inset-0 bg-linear-to-br from-button/10 via-purple-500/10 to-pink-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative h-full bg-slate-800/40 backdrop-blur-sm border border-border-light/30 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-10 right-10 w-32 h-32 bg-button/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-xl"></div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
              <div className="mb-8">
                <div className="inline-flex p-6 bg-button/10 backdrop-blur-sm rounded-2xl border border-button/30 mb-6">
                  <FaCode className="text-accent-light text-7xl" />
                </div>
                <h2 className="text-font-light text-3xl lg:text-4xl font-bold mb-4">
                  Transforma tu futuro
                </h2>
                <p className="text-slate-300 text-lg max-w-md mx-auto">
                  Únete a miles de estudiantes que ya están construyendo sus
                  carreras tech
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
                <div className="text-center">
                  <div className="text-button text-3xl font-bold mb-1">50+</div>
                  <div className="text-slate-400 text-sm">Cursos</div>
                </div>
                <div className="text-center border-x border-slate-700/50">
                  <div className="text-button text-3xl font-bold mb-1">
                    10k+
                  </div>
                  <div className="text-slate-400 text-sm">Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-button text-3xl font-bold mb-1">95%</div>
                  <div className="text-slate-400 text-sm">Satisfacción</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
                  <FaRocket className="text-accent-medium" />
                  <span className="text-slate-200 text-sm">
                    Proyectos reales
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
                  <FaCertificate className="text-accent-medium" />
                  <span className="text-slate-200 text-sm">Certificados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCards;
