"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiCheckCircle,
  HiSparkles,
  HiArrowRight,
  HiHome,
} from "react-icons/hi";
import Link from "next/link";

export default function PaymentSuccess() {
  const router = useRouter();
  const [message, setMessage] = useState("Verificando tu pago...");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessage("¡Pago completado exitosamente!");
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 text-center shadow-2xl hover:border-slate-600/50 transition-all duration-300">
    
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-green-500/10 border-2 border-green-500/50 rounded-full flex items-center justify-center backdrop-blur-sm">
              <HiCheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-400 animate-bounce" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
            ¡Pago exitoso!
          </h1>

          <p className="text-slate-300 text-base md:text-lg mb-8">{message}</p>

          {showContent && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-button/10 border border-button/30 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <HiSparkles className="w-6 h-6 text-yellow-400" />
                  <p className="text-slate-200 font-semibold text-sm md:text-base">
                    Tus cursos ya están disponibles
                  </p>
                </div>
                <p className="text-slate-400 text-sm">
                  Comienza tu aprendizaje ahora mismo
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <Link
                  href={"/dashboard"}
                  className="group w-full cursor-pointer bg-button hover:bg-button/80 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-3"
                >
                  <span>Ver mis cursos</span>
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <button
                  onClick={() => router.push("/")}
                  className="group cursor-pointer w-full bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 text-slate-200 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  <HiHome className="w-5 h-5" />
                  <span>Volver al inicio</span>
                </button>
              </div>
            </div>
          )}

          {!showContent && (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button"></div>
              <p className="text-slate-400 text-sm">Procesando...</p>
            </div>
          )}
        </div>

        {showContent && (
          <div className="mt-8 text-center animate-fadeIn">
            <p className="text-slate-400 text-sm">
              ¿Necesitas ayuda?{" "}
              <Link 
                href="/contact-us"
                className="text-button hover:underline font-semibold"
              >
                Contáctanos
              </Link>
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
