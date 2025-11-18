"use client";

import IndividualCourses from "@/components/Plans/IndividualCourses";
import MembershipPlans from "@/components/Plans/MembershipPlans";
import PricingHeader from "@/components/Plans/PricingHeader";
import Link from "next/link";
import { useState } from "react";

const PlansPage = () => {
  const [activeTab, setActiveTab] = useState<"memberships" | "courses">(
    "memberships"
  );

  return (
    <div className="min-h-screen pt-15 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(126, 75, 222, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-3">
          <div className="inline-flex px-4 py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-6">
            <span className="text-font-light font-semibold md:text-lg">
              Planes y Precios
            </span>
          </div>
        </div>

        <PricingHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="relative min-h-[800px] sm:min-h-[900px] md:min-h-[600px]">
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeTab === "memberships"
                ? "opacity-100 translate-x-0 relative"
                : "opacity-0 -translate-x-8 absolute inset-0 pointer-events-none"
            }`}
          >
            <MembershipPlans />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              activeTab === "courses"
                ? "opacity-100 translate-x-0 relative"
                : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"
            }`}
          >
            <IndividualCourses />
          </div>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-font-light text-3xl font-bold text-center mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-border-light/50 rounded-xl p-6">
              <h3 className="text-font-light font-semibold text-lg mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-slate-400 text-sm">
                Sí, puedes actualizar o cambiar tu plan en cualquier momento
                desde tu panel de usuario. Los cambios se aplicarán
                inmediatamente.
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-border-light/50 rounded-xl p-6">
              <h3 className="text-font-light font-semibold text-lg mb-2">
                ¿Qué incluye el acceso a cursos individuales?
              </h3>
              <p className="text-slate-400 text-sm">
                Al comprar un curso individual, obtienes acceso permanente al
                contenido, todos los materiales descargables, certificado de
                finalización y todas las actualizaciones futuras sin costo
                adicional.
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-border-light/50 rounded-xl p-6">
              <h3 className="text-font-light font-semibold text-lg mb-2">
                ¿Los certificados son válidos profesionalmente?
              </h3>
              <p className="text-slate-400 text-sm">
                Nuestros certificados verificables son reconocidos en la
                industria y pueden ser compartidos en LinkedIn y otras
                plataformas profesionales.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-15 text-center px-4">
          <div className="p-6 sm:p-8 md:p-12">
            <h2 className="text-font-light text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              ¿Aún tienes dudas?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
              Nuestro equipo está listo para ayudarte a elegir el mejor plan
              para tus necesidades
            </p>
            <Link
              href={"/contact-us"}
              className="inline-block px-6 sm:px-8 py-3 bg-button hover:bg-button/80 text-font-light font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-button/30 text-sm sm:text-base whitespace-nowrap"
            >
              Contactar con soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
