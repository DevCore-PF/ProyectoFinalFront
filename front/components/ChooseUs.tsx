import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      number: "01",
      title: "Horario de estudio flexible",
      description:
        "Organiza tus cursos según tus compromisos y responsabilidades.",
    },
    {
      id: 2,
      number: "02",
      title: "Instrucciones de expertos",
      description:
        "Aprende de profesionales con experiencia real en diseño y desarrollo.",
    },
    {
      id: 3,
      number: "03",
      title: "Variedad de cursos",
      description:
        "Explora una amplia gama de temas de diseño y desarrollo sobre distintos temas.",
    },
    {
      id: 4,
      number: "04",
      title: "Contenido actualizado",
      description:
        "Accede a tutoriales actualizados que reflejan las últimas tendencias y prácticas de la industria.",
    },
    {
      id: 5,
      number: "05",
      title: "Proyectos y ejercicios prácticos",
      description:
        "Desarrolla tus habilidades que requiere una experiencia en el mundo real.",
    },
    {
      id: 6,
      number: "06",
      title: "Entorno de aprendizaje interactivo",
      description:
        "Conéctate con otros estudiantes, intercambia ideas y recibe retroalimentación para mejorar tu aprendizaje.",
    },
  ];

  return (
    <div className="min-h-screen p-8 md:p-25">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
              Por qué elegir DevCore?
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl">
              Con un énfasis en el aprendizaje práctico y proyectos, y
              desarrolla habilidades reales mientras colaboras con otros
              estudiantes en un entorno interactivo y dinámico
            </p>
          </div>
          <Link
            href="/about"
            className="bg-slate-700/50 hover:bg-slate-700 text-font-light px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
          >
            Ver más
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
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