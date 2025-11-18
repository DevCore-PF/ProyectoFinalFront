'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const UnderConstruction = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };
  return (
    <main className="relative min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px] overflow-hidden">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        
        
        <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          
          
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-title font-bold text-font-light">
              🚧
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-title font-bold text-font-light mb-3 sm:mb-4 px-2">
              Página en
              <span className="bg-gradient-to-r from-button to-accent-medium bg-clip-text text-transparent ml-2 sm:ml-3">
                Construcción
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-font-light/80 font-body max-w-lg mx-auto px-4">
              Estamos trabajando duro para traerte algo increíble. ¡Vuelve pronto!
            </p>
          </div>

          
          {/* Animación mejorada con construcción */}
          <div className="relative px-2 sm:px-0">
            <div className="bg-gradient-to-br from-background2/40 to-background2/20 border border-border rounded-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
              {/* Partículas de fondo */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-medium/30 rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Contenedor de herramientas animadas */}
              <div className="relative">
                {/* Martillo animado */}
                <div className="flex justify-center items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl animate-swing origin-top-right">
                    🔨
                  </div>
                  <div className="text-4xl sm:text-5xl md:text-6xl animate-pulse">
                    ⚙️
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl animate-swing-reverse origin-top-left">
                    🔧
                  </div>
                </div>

                {/* Barra de carga animada con efecto de construcción */}
                <div className="mt-6 sm:mt-8 space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-2 px-1">
                    <span>Construyendo...</span>
                    <span className="text-accent-medium font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-full h-3 sm:h-4 border border-slate-700/50 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-button via-accent-medium to-button rounded-full relative animate-progress"
                      style={{ width: '75%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Efectos de brillo alrededor */}
            <div className="absolute -inset-1 bg-gradient-to-r from-button/20 to-accent-medium/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
          </div>

          
          <div className="bg-gradient-to-br from-background2/30 to-background2/10 border border-border-light/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm mx-2 sm:mx-0">
            <p className="text-font-light/90 font-body text-base sm:text-lg">
              <span className="text-accent-light font-semibold">DevCore</span> está codificando intensamente...
            </p>
            <p className="text-font-light/70 text-xs sm:text-sm mt-2">
              Nuestro equipo trabaja sin descanso para traerte esta funcionalidad 💪
            </p>
          </div>

          
          <div className="pt-4 sm:pt-6">
            <button
              onClick={handleGoHome}
              data-button
              className="bg-button hover:bg-button/90 text-font-light px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 border border-border-light/20 backdrop-blur-sm cursor-pointer hover:scale-105 transform w-full sm:w-auto"
            >
              ← Ir al inicio
            </button>
          </div>

        </div>

        
        {/* Íconos flotantes mejorados con animaciones - responsivos */}
        <div className="hidden sm:block absolute top-20 left-10 text-2xl sm:text-3xl opacity-20 animate-float-slow">
          💻
        </div>
        <div className="hidden sm:block absolute top-40 right-20 text-2xl sm:text-3xl opacity-20 animate-float-slow" style={{ animationDelay: '1s' }}>
          ☕
        </div>
        <div className="hidden sm:block absolute bottom-20 left-20 text-2xl sm:text-3xl opacity-20 animate-float-slow" style={{ animationDelay: '0.5s' }}>
          🚀
        </div>
        <div className="hidden sm:block absolute bottom-40 right-10 text-2xl sm:text-3xl opacity-20 animate-float-slow" style={{ animationDelay: '1.5s' }}>
          ⚡
        </div>
        <div className="hidden md:block absolute top-1/3 left-1/4 text-xl sm:text-2xl opacity-15 animate-float-slow" style={{ animationDelay: '2s' }}>
          🎨
        </div>
        <div className="hidden md:block absolute top-2/3 right-1/4 text-xl sm:text-2xl opacity-15 animate-float-slow" style={{ animationDelay: '2.5s' }}>
          🔥
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
        }

        @keyframes swing {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        @keyframes swing-reverse {
          0%, 100% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(-10deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 75%;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }

        .animate-swing-reverse {
          animation: swing-reverse 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out;
        }
      `}</style>
    </main>
  );
};

export default UnderConstruction;