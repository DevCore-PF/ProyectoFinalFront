//Next/React
import Link from "next/link";

//Icons
import {
  FaChartLine,
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaRocket,
  FaGlobe,
  FaCheckCircle,
  FaBookOpen,
  FaCode,
  FaTrophy,
  FaHandshake,
} from "react-icons/fa";

interface GoalCardProps {
  title: string;
  description: string;

  icon: React.ElementType;
  target: string;
}

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  icon: Icon,
  target,
}) => {
  return (
    <div className="p-4 bg-background2 rounded-lg border border-gray-800 hover:border-button transition-colors duration-300">
      <div className="flex items-center mb-2">
        <Icon size={20} className="text-blue-500 mr-3" />
        <h4 className="text-base font-semibold text-gray-100">{title}</h4>
      </div>
      <p className="text-sm text-gray-400 mb-2">{description}</p>
      <div className="text-xs text-yellow-light mt-2 pt-2 border-t border-gray-800">
        Objetivo: {target}
      </div>
    </div>
  );
};

const OurGoalsPage = () => {
  return (
    <div className="min-h-screen bg-background2 text-gray-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-font-light mb-3">
            Nuestros Objetivos de Crecimiento
          </h1>
          <p className="text-base text-gray-300 max-w-4xl mx-auto">
            Definimos nuestro futuro con metas claras. Estos son los compromisos
            de DevCore para el próximo año fiscal y cómo planeamos alcanzarlos
            junto a nuestra comunidad.
          </p>
        </header>

        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-yellow-light text-center">
            Metas Estratégicas para el Próximo Año
          </h2>

          <div className="space-y-10">
            <div className="bg-navbar p-8 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-100">
                <FaDollarSign className="mr-3 text-yellow-light" size={24} /> 1.
                Monetización y Éxito del Profesorado
              </h3>
              <p className="text-base text-gray-300 mb-6">
                Nuestro principal objetivo es garantizar que la creación de
                contenido sea una fuente de ingresos sostenible y creciente para
                nuestros educadores.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GoalCard
                  title="Meta Creadores: 100 Profesores"
                  description="Expandir nuestro equipo fundador a 100 profesores activos, cubriendo todos los stacks tecnológicos relevantes."
                  icon={FaUsers}
                  target="Q4 del Próximo Año"
                />
                <GoalCard
                  title="Ingresos Pasivos: +50% Promedio"
                  description="Aumentar el pago promedio trimestral a los creadores de contenido por concepto de regalías de membresía en un 50%."
                  icon={FaChartLine}
                  target="Trimestral"
                />
                <GoalCard
                  title="Lanzamiento de 250 Cursos"
                  description="Superar la marca de 250 cursos disponibles en la biblioteca, manteniendo un estándar de calidad riguroso."
                  icon={FaBookOpen}
                  target="Final del Año"
                />
              </div>
            </div>

            <div className="bg-navbar p-8 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-100">
                <FaGraduationCap className="mr-3 text-yellow-light" size={24} />{" "}
                2. Experiencia y Retención del Estudiante
              </h3>
              <p className="text-base text-gray-300 mb-6">
                Nos enfocamos en ofrecer un entorno de aprendizaje adictivo,
                flexible y que impulse resultados concretos.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GoalCard
                  title="Retención: 80% Suscriptores"
                  description="Asegurar que al menos el 80% de los suscriptores de 3 meses renueven su membresía al final de su periodo."
                  icon={FaCheckCircle}
                  target="Cada Cohorte"
                />
                <GoalCard
                  title="Soporte: Tiempo de Respuesta < 2h"
                  description="Optimizar el soporte técnico y de contenido para responder a las consultas de los alumnos en menos de dos horas."
                  icon={FaUsers}
                  target="Continuo"
                />
                <GoalCard
                  title="Certificación de Proyectos"
                  description="Lanzar un sistema de revisión de proyectos final para ofrecer un certificado respaldado por DevCore de alto valor."
                  icon={FaTrophy}
                  target="Q3 del Próximo Año"
                />
              </div>
            </div>

            <div className="bg-navbar p-8 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-100">
                <FaRocket className="mr-3 text-yellow-light" size={24} /> 3.
                Innovación y Expansión Global
              </h3>
              <p className="text-base text-gray-300 mb-6">
                Queremos que DevCore sea sinónimo de tecnología de vanguardia y
                alcance global.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GoalCard
                  title="Integración de IA"
                  description="Implementar una herramienta de asistente de codificación basada en IA para dar soporte inmediato a los estudiantes."
                  icon={FaCode}
                  target="Q2 del Próximo Año"
                />
                <GoalCard
                  title="Expansión a 5 Países"
                  description="Fortalecer nuestra presencia de marketing y comunidad en 5 países hispanohablantes clave fuera de nuestra región actual."
                  icon={FaGlobe}
                  target="Final del Año"
                />
                <GoalCard
                  title="Módulo de Empleabilidad"
                  description="Crear y mantener un módulo gratuito de preparación para entrevistas técnicas y revisión de CV para suscriptores."
                  icon={FaHandshake}
                  target="Q4 del Próximo Año"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 border-t border-gray-800 pt-10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-light text-center">
            El “Por Qué” de Nuestros Objetivos
          </h2>
          <p className="text-base text-gray-300 max-w-4xl mx-auto mb-8 text-center">
            Nuestra visión no es solo crecer; es crear una relación simbiótica.
            Si alcanzamos estas metas, los profesores ganan más y los
            estudiantes reciben un producto de mayor valor.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-navbar/50 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-gray-100 mb-2">
                Para el Profesor: Más Monetización
              </h4>
              <p className="text-sm text-gray-400">
                Alcanzar los objetivos de crecimiento de alumnos y suscripciones
                significa una distribución de regalías mayor y más confiable
                para todos los creadores en la plataforma.
              </p>
            </div>
            <div className="bg-navbar/50 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-gray-100 mb-2">
                Para el Alumno: Más Calidad
              </h4>
              <p className="text-sm text-gray-400">
                El crecimiento del profesorado y la inversión en IA resultan
                directamente en mejor contenido, mejor soporte y una experiencia
                de aprendizaje que te mantiene a la vanguardia.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center pt-10 border-t border-gray-800">
          <h3 className="text-2xl font-bold mb-4">
            Ayúdanos a Cumplir Estos Objetivos
          </h3>
          <p className="text-base text-gray-300 mb-6">
            Tu participación es la fuerza motriz que convierte estas metas en
            realidad.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/plans"
              className="border border-font-light/10 bg-navbar text-font-light font-bold rounded-md px-6 py-3 text-md hover:bg-button transition-colors duration-100"
            >
              Conviértete en Suscriptor
            </Link>
            <Link
              href="/become-a-teacher"
              className="border border-font-light/10  bg-navbar text-font-light font-bold rounded-md px-6 py-3 text-md hover:bg-button transition-colors duration-100"
            >
              Únete como Profesor
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OurGoalsPage;

// kk
