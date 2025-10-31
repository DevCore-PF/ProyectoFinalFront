"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiRefresh, HiHome, HiShoppingCart } from "react-icons/hi";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function PaymentCancelled() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 text-center shadow-2xl hover:border-slate-600/50 transition-all duration-300">
         
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-yellow-500/10 border-2 border-yellow-500/50 rounded-full flex items-center justify-center backdrop-blur-sm">
              <HiExclamationTriangle className="w-12 h-12 md:w-16 md:h-16 text-yellow-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
            Pago cancelado
          </h1>

          <p className="text-slate-300 text-base md:text-lg mb-8">
            No se realizó ningún cargo. Puedes intentar nuevamente cuando estés
            listo.
          </p>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 mb-8 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-2">
              <HiShoppingCart className="w-6 h-6 text-slate-400" />
              <p className="text-slate-300 font-semibold text-sm md:text-base">
                Tus cursos siguen en el carrito
              </p>
            </div>
            <p className="text-slate-400 text-sm">
              Completa tu compra cuando lo desees
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            <button
              onClick={() => router.push("/checkout")}
              className="group cursor-pointer w-full bg-button hover:bg-button/80 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-3"
            >
              <HiRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Intentar de nuevo</span>
            </button>

            <Link
              href={"/"}
              className="group cursor-pointer w-full bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 text-slate-200 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              <HiHome className="w-5 h-5" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-3">
            ¿Tuviste algún problema con el pago?
          </p>
          <Link 
            href="/contact-us"
            className="text-button hover:underline font-semibold text-sm inline-flex items-center gap-2"
          >
            Contáctanos para ayudarte
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
