"use client";

import { faqCategories, faqsByCategory } from "@/helpers/moks";
import Link from "next/link";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<string | null>("estudiantes-0");
  const [activeCategory, setActiveCategory] = useState("estudiantes");

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-12">
          <div className="inline-flex px-4 py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-6">
            <span className="text-font-light font-semibold md:text-lg">
              Centro de Ayuda
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
            Preguntas frecuentes
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Contacta a nuestro equipo a través de{" "}
            <a
              href="mailto:support@devcore.com"
              className="text-accent-medium hover:underline"
            >
              support@devcore.com
            </a>
            , estaremos encantados de ayudarte.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenIndex(`${category.id}-0`);
                }}
                className={`flex  cursor-pointer items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                  activeCategory === category.id
                    ? "bg-button/90 text-font-light  border-transparent"
                    : "bg-slate-800/40 text-slate-300 hover:bg-slate-800/60 border border-border-light/50"
                }`}
              >
                <Icon className="text-base" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 mb-8">
          {faqsByCategory[activeCategory as keyof typeof faqsByCategory].map(
            (faq, index) => {
              const faqId = `${activeCategory}-${index}`;
              return (
                <div
                  key={faqId}
                  className="bg-slate-800/40 backdrop-blur-sm border border-border-light/70 rounded-xl overflow-hidden hover:border-border-light hover:shadow-accent-light/30 shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(faqId)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors duration-300"
                  >
                    <span className="text-font-light font-medium text-sm md:text-base pr-4">
                      {faq.question}
                    </span>
                    <div className="shrink-0 cursor-pointer hover:border-border-light border border-transparent w-8 h-8 flex items-center justify-center rounded-lg bg-button/20">
                      {openIndex === faqId ? (
                        <FaMinus className="text-button text-sm" />
                      ) : (
                        <FaPlus className="text-button text-sm" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === faqId
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="mt-20 text-center">
          <div className="">
            <h2 className="text-font-light text-3xl md:text-4xl font-bold mb-4">
              ¿Aún tienes dudas?
            </h2>
            <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
              Nuestro equipo está listo para ayudarte a encontrar las respuestas
              que necesitas
            </p>
            <Link href={'/contact-us'} className="px-8 py-3 bg-button hover:bg-button/80 text-font-light font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-button/30">
              Contactar con soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
