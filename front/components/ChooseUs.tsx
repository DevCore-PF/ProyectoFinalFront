import { featuresChooseUs } from "@/helpers/moks";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

const WhyChooseUs = () => {
  return (
    <div className="min-h-screen p-8 md:p-25">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
              Por qué elegir DevCore?
            </h2>
            <p className="text-slate-300 text-base md:text-lg ">
              Con un énfasis en el aprendizaje práctico y proyectos, y
              desarrolla habilidades reales mientras colaboras con otros
              estudiantes en un entorno interactivo y dinámico
            </p>
          </div>
        
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresChooseUs.map((feature) => (
            <div
              key={feature.id}
              className="bg-background2 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-border-light/80 group"
            >
              <div className="text-6xl md:text-7xl font-bold text-font-light mb-6">
                {feature.number}
              </div>
              <h3 className="text-font-light text-xl md:text-2xl font-bold mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
