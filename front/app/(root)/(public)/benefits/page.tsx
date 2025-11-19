"use client";

//Next/React
import { useAuth } from "@/context/UserContext";
import Link from "next/link";

//Icons
import {
  FaTrophy,
  FaLightbulb,
  FaCode,
  FaComments,
  FaHandshake,
  FaBookOpen,
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaRocket,
  FaGraduationCap,
} from "react-icons/fa";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  tag: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  title,
  description,
  icon: Icon,
  tag,
}) => {
  return (
    <div className="p-4 sm:p-5 bg-background2 rounded-lg border border-gray-800 hover:border-button transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-start mb-2 sm:mb-3">
        <Icon size={20} className="text-blue-500 mr-2 sm:mr-3 shrink-0 mt-0.5" />
        <h4 className="text-sm sm:text-base font-semibold text-gray-100 break-words">
          {title}
        </h4>
      </div>
      <p className="text-xs sm:text-sm text-gray-400 flex-1 mb-2">
        {description}
      </p>
      <div className="text-xs text-yellow-light mt-2 pt-2 border-t border-gray-800">
        Ventaja: {tag}
      </div>
    </div>
  );
};

const BenefitsPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen text-gray-100 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-4 sm:mb-6">
            <span className="text-font-light font-semibold text-sm sm:text-base lg:text-lg">
              Valor y Beneficios
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-font-light mb-3 px-4">
            Sé parte de 
            <span className="text-accent-medium"> DevCore.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-4xl mx-auto px-4">
            Descubre por qué DevCore es la mejor plataforma para impulsar tu
            carrera tecnológica o monetizar tu conocimiento. Hemos diseñado una
            experiencia de valor único para cada miembro.
          </p>
        </header>

        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-navbar p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center text-gray-100 gap-2">
              <FaGraduationCap className="text-yellow-light shrink-0" size={24} />
              <span>1. Beneficios Clave para Estudiantes</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Te garantizamos un aprendizaje práctico, actualizado y enfocado en
              las habilidades que realmente demandan las empresas.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <BenefitCard
                title="Aprendizaje Orientado a Proyectos"
                description="Cada curso finaliza con un proyecto real que puedes añadir a tu portafolio, garantizando que el conocimiento se convierte en habilidad."
                icon={FaCode}
                tag="Portafolio Tangible"
              />
              <BenefitCard
                title="Soporte Asistido por IA y Comunidad"
                description="Resuelve tus dudas en segundos con nuestro asistente de codificación basado en IA, complementado por la ayuda de instructores y compañeros."
                icon={FaComments}
                tag="Resolución Inmediata"
              />
              <BenefitCard
                title="Certificados de Alto Valor"
                description="Obtén certificaciones por módulos y proyectos finales que tienen peso real en tu currículum, avalados por expertos de la industria."
                icon={FaTrophy}
                tag="Reconocimiento Profesional"
              />
            </div>
          </div>
        </section>

        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-navbar p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center text-gray-100 gap-2">
              <FaDollarSign className="text-yellow-light shrink-0" size={24} />
              <span>2. Ventajas Únicas para Creadores</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Monetiza tu experiencia con un modelo de regalías transparente y
              céntrate únicamente en la creación, nosotros nos encargamos del
              marketing y la plataforma.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <BenefitCard
                title="Regalías Predictivas y Justas"
                description="Nuestro modelo de ingresos garantiza una distribución de regalías basada en la demanda y tiempo de consumo de tu contenido."
                icon={FaChartLine}
                tag="Ingreso Sostenible"
              />
              <BenefitCard
                title="Plataforma de Contenido Premium"
                description="Accede a un set de herramientas de producción y análisis de datos para crear cursos de la más alta calidad y optimizados para el mercado."
                icon={FaRocket}
                tag="Herramientas Avanzadas"
              />
              <BenefitCard
                title="Comunidad y Colaboración"
                description="Conéctate con otros instructores y mentores para mejorar tu contenido y expandir tu alcance a audiencias globales."
                icon={FaUsers}
                tag="Networking Profesional"
              />
            </div>
          </div>
        </section>

        {/* --- SECCIÓN DE VALOR AÑADIDO / COMÚN --- */}
        <section className="mb-12 sm:mb-16 border-t border-gray-800 pt-8 sm:pt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-light text-center px-4">
            Valor Añadido para Toda la Comunidad
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 text-center px-4">
            Beneficios que hacen de DevCore un ecosistema completo para el
            crecimiento profesional, sin importar tu rol.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-navbar/50 p-4 sm:p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
              <FaHandshake size={32} className="text-blue-500 mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                Bolsa de Empleo Exclusiva
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Conexión directa con empresas aliadas que buscan talento
                certificado por DevCore.
              </p>
            </div>
            <div className="bg-navbar/50 p-4 sm:p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
              <FaLightbulb size={32} className="text-blue-500 mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                Actualizaciones Continuas
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Todo el contenido se actualiza semestralmente para garantizar el
                uso de las últimas tecnologías.
              </p>
            </div>
            <div className="bg-navbar/50 p-4 sm:p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
              <FaBookOpen size={32} className="text-blue-500 mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                Acceso Ilimitado
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Una sola suscripción te da acceso total a toda la librería de
                cursos y recursos.
              </p>
            </div>
            <div className="bg-navbar/50 p-4 sm:p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
              <FaCode size={32} className="text-blue-500 mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                Entornos de Práctica
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Entornos de codificación integrados en la plataforma para
                practicar sin configurar nada.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center pt-8 sm:pt-10 border-t border-gray-800 px-4">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Comienza a Recibir Estos Beneficios Hoy
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
            Elige el rol que te define y da el siguiente paso en DevCore.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/plans"
              className="border border-font-light/10 bg-navbar text-font-light font-bold rounded-md px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:bg-button/90 transition-colors duration-250"
            >
              Quiero Aprender
            </Link>
            <Link
              href={`${user ? "/teacher-dashboard" : "/register"}`}
              className="border border-font-light/10 bg-navbar text-font-light font-bold rounded-md px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:bg-button/90 transition-colors duration-250"
            >
              Quiero Enseñar
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BenefitsPage;
