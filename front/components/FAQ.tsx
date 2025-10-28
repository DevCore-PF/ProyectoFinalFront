"use client";

import { faqs } from "@/helpers/moks";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen py-15 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Preguntas frecuentes
          </h2>
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

        <div className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/40 backdrop-blur-sm border border-border-light/70 rounded-xl overflow-hidden hover:border-border-light hover:shadow-accent-light/30 shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors duration-300"
              >
                <span className="text-white font-medium text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <div className="shrink-0 cursor-pointer hover:border-border-light border border-transparent w-8 h-8 flex items-center justify-center rounded-lg bg-button/20">
                  {openIndex === index ? (
                    <FaMinus className="text-button text-sm" />
                  ) : (
                    <FaPlus className="text-button text-sm" />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
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
          ))}
        </div>

        <div className="text-center">
          <button className="px-6 py-3 cursor-pointer  text-font-light border border-border-light hover:bg-button/30   font-semibold rounded-lg transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95">
            Más preguntas frecuentes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
