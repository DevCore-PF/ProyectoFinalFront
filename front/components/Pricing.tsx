"use client";

import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = {
    pro: {
      name: "Plan Pro",
      price: billingPeriod === "monthly" ? 79 : 790,
      period: billingPeriod === "monthly" ? "/mensual" : "/anual",
      features: [
        { text: "Acceso ilimitado a todos los cursos.", included: true },
        { text: "Materiales y recursos sin restricciones.", included: true },
        { text: "Soporte prioritario de los instructores.", included: true },
        { text: "Certificados al completar los cursos.", included: true },
        { text: "Experiencia libre de anuncios.", included: true },
        {
          text: "Acceso a los foros exclusivos de la comunidad de DevCore.",
          included: true,
        },
        {
          text: "Acceso anticipado a nuevos cursos y actualizaciones.",
          included: true,
        },
      ],
      highlighted: true,
    },
    free: {
      name: "Gratis",
      price: 0,
      period: "",
      features: [
        { text: "Acceso a cursos gratuitos seleccionados.", included: true },
        { text: "Materiales y recursos del curso limitados.", included: true },
        { text: "Sin certificación al completar el curso.", included: true },
        { text: "Plataforma con anuncios.", included: true },
        {
          text: "Acceso a foros exclusivos de la comunidad del Plan Pro.",
          included: false,
        },
        {
          text: "Acceso anticipado a nuevos cursos y actualizaciones.",
          included: false,
        },
      ],
      highlighted: false,
    },
  };

  return (
    <div className="min-h-screen py-15 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
            Planes
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8">
            Descubre nuestra programación más desarrollada y escoge el paquete
            perfecto para tu ritmo de aprendizaje. Construye un portafolio
            sólido que te ayude a destacarte ante empleadores y clientes.
          </p>

          <div className="inline-flex items-center gap-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                billingPeriod === "monthly"
                  ? "bg-button/80 text-font-light"
                  : "text-slate-300 hover:text-font-light hover:cursor-pointer"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                billingPeriod === "annual"
                  ? "bg-button/80 text-font-light"
                  : "text-slate-300 hover:text-font-light hover:cursor-pointer"
              }`}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-linear-to-br from-button/30 to-background backdrop-blur-sm border-2 border-border rounded-2xl p-8 hover:border-border-light transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-button/20">
            <h3 className="text-font-light text-3xl font-bold mb-2">
              {plans.pro.name}
            </h3>
            <div className="mb-6">
              <span className="text-font-light text-5xl font-bold">
                ${plans.pro.price}
              </span>
              <span className="text-slate-300 text-lg">{plans.pro.period}</span>
            </div>

            <div className="space-y-4 mb-8">
              {plans.pro.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <FaCheck className="text-accent-medium text-sm" />
                  </div>
                  <span className="text-slate-200 text-sm leading-relaxed">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full cursor-pointer bg-button/80 hover:bg-button text-font-light font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-button/30">
              Get Started
            </button>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
            <h3 className="text-font-light text-3xl font-bold mb-2">
              {plans.free.name}
            </h3>
            <div className="mb-6">
              <span className="text-font-light text-5xl font-bold">
                ${plans.free.price}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {plans.free.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {feature.included ? (
                      <FaCheck className="text-slate-400 text-sm" />
                    ) : (
                      <FaTimes className="text-slate-600 text-sm" />
                    )}
                  </div>
                  <span
                    className={`text-sm leading-relaxed ${
                      feature.included ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full cursor-pointer bg-button/80 hover:bg-button text-font-light font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-button/30">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
