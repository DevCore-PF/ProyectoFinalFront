import { testimonials } from "@/helpers/moks";
import { FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";

const Testimonials = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Testimonios
            </h2>
            <p className="text-slate-300 text-sm md:text-base ">
              Nuestros estudiantes valoran la facilidad de aprendizaje de los
              cursos grabados, el amplio catálogo de las instrucciones y
              posibilidades de practicar en un ritmo, grabando confianza e
              instituciones reales en programación y diseño.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-600/40 border border-slate-400/50  rounded-2xl overflow-hidden ">
            <div className="flex h-full">
              <div className="relative w-32 sm:w-40 shrink-0">
                <FaQuoteLeft className="absolute top-4 left-4 text-white/80 text-2xl z-10" />
                <img
                  src={testimonials[0].image}
                  alt={testimonials[0].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4">
                  {testimonials[0].text}
                </p>
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonials[0].name}
                  </h4>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <span>{testimonials[0].flag}</span>{" "}
                    {testimonials[0].country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-600/40  border  border-slate-400/50  rounded-2xl overflow-hidden ">
            <div className="flex h-full">
              <div className="relative w-32 sm:w-40 shrink-0">
                <FaQuoteLeft className="absolute top-4 left-4 text-white/80 text-2xl z-10" />
                <img
                  src={testimonials[1].image}
                  alt={testimonials[1].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4">
                  {testimonials[1].text}
                </p>
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonials[1].name}
                  </h4>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <span>{testimonials[1].flag}</span>{" "}
                    {testimonials[1].country}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-slate-600/40 border  border-slate-400/50  rounded-2xl overflow-hidden ">
            <div className="flex h-full">
              <div className="relative w-32 sm:w-40 shrink-0">
                <FaQuoteLeft className="absolute top-4 left-4 text-white/80 text-2xl z-10" />
                <img
                  src={testimonials[2].image}
                  alt={testimonials[2].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4">
                  {testimonials[2].text}
                </p>
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonials[2].name}
                  </h4>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <span>{testimonials[2].flag}</span>{" "}
                    {testimonials[2].country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
