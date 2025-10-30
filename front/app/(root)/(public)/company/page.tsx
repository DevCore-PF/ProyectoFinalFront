// Next/React
import Link from "next/link";
import Image from "next/image";

//Icons
import {
  FaRocket,
  FaHandshake,
  FaSeedling,
  FaUsers,
  FaLightbulb,
  FaLockOpen,
} from "react-icons/fa";

const CompanyPage = () => {
  return (
    <div className="min-h-screen bg-background2 text-gray-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-yellow-light mb-3">
            DevCore: La Empresa y Nuestra Oportunidad Fundacional
          </h1>
          <p className="text-base text-gray-300 max-w-3xl mx-auto">
            Somos una startup de EdTech con la misión de redefinir la formación
            de desarrolladores. Buscamos a los pioneros que definirán el futuro
            de nuestra escuela.
          </p>
        </header>

        <section className="mb-16 text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-100">
            Nuestros Pilares de Crecimiento
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-navbar p-6 rounded-xl border border-gray-700 hover:border-font-light">
              <FaRocket size={28} className="text-yellow-light mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Misión Pionera</h3>
              <p className="text-sm text-gray-300">
                Construir un currículo 100% relevante para la industria moderna,
                sin teorías obsoletas, y con feedback directo de la comunidad.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700  hover:border-font-light">
              <FaSeedling
                size={28}
                className="text-yellow-light mx-auto mb-3"
              />
              <h3 className="text-xl font-semibold mb-2">
                Visión de Escalamiento
              </h3>
              <p className="text-sm text-gray-300">
                Escalar de ser una startup a ser el referente en LATAM,
                manteniendo la calidad y la atención personalizada a medida que
                crecemos.
              </p>
            </div>

            <div className="bg-navbar p-6 rounded-xl border border-gray-700  hover:border-font-light">
              <FaUsers size={28} className="text-yellow-light mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Valores Centrales</h3>
              <p className="text-sm text-gray-300">
                Generosidad de Conocimiento, Transparencia Radical y Excelencia
                en el Desarrollo de Software.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20 bg-navbar p-10 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-yellow-light flex items-center">
            <FaLightbulb className="mr-3" /> Nuestra Inversión en Ti
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-base text-gray-200 mb-4">
                Entendemos que unirte a una escuela nueva es un acto de fe. Por
                eso, recompensamos a nuestros primeros alumnos y profesores por
                su confianza con beneficios tangibles que no estarán disponibles
                en el futuro:
              </p>

              <ul className="space-y-2 text-sm text-gray-300 font-light list-disc list-inside">
                <li>
                  <strong className="font-bold">
                    Precios de Adhesión (Alumnos):
                  </strong>{" "}
                  Tarifas de por vida significativamente más bajas para asegurar
                  tu apoyo inicial.
                </li>
                <li>
                  <strong className="font-bold">
                    Equity (Profesores Fundadores):{" "}
                  </strong>
                  Oportunidades de participación en el éxito de la empresa a
                  largo plazo.
                </li>
                <li>
                  <strong className="font-bold">
                    Acceso Directo al Liderazgo:
                  </strong>{" "}
                  Comunicación sin filtros con los fundadores para influir
                  directamente en las decisiones clave.
                </li>
              </ul>
            </div>

            <div className="relative h-60 w-full ">
              <Image
                alt="Imagen simbólica de una asociación y crecimiento"
                src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761745223/imagenCrecimiento02_ycd0oz.webp"
                layout="fill"
                objectFit="cover"
                className="rounded-lg opacity-80 object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-yellow-light">
            La Oportunidad de Ser Pionero
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-navbar/50 p-6 rounded-xl border border-gray-700 h-full">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <FaHandshake className="mr-2" /> Eres el Futuro Alumno Fundador
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Si buscas atención hiper-personalizada y un currículo que se
                siente nuevo cada semana, este es el lugar. Tus primeras
                contribuciones como alumno pionero son invaluables.
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-block relative text-yellow-light text-sm font-semibold 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 
             after:w-0 after:h-px after:bg-yellow-light 
             after:transition-all after:duration-400 hover:after:w-full"
              >
                Estudia que curso sea el ideal para ti →
              </Link>
            </div>

            <div className="bg-navbar/50 p-6 rounded-xl border border-gray-700 h-full">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <FaUsers className="mr-2" /> Eres el Profesor Arquitecto
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Buscamos a los mejores expertos que sean **generosos** con su
                tiempo. No solo enseñaras, sino que **diseñarás** la experiencia
                educativa de cero y tendrás un rol clave.
              </p>
              <Link
                href="/register"
                className="mt-4 inline-block relative text-yellow-light text-sm font-semibold 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 
             after:w-0 after:h-px after:bg-yellow-light 
             after:transition-all after:duration-400 hover:after:w-full"
              >
                Regístrate y Moldea la Academia →
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16 border-t border-gray-800 pt-10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-light text-center flex items-center justify-center">
            <FaLockOpen className="mr-3" /> Manifiesto de Transparencia
          </h2>
          <p className="text-base text-gray-300 max-w-4xl mx-auto mb-6 text-center">
            Como empresa nueva, nuestra única moneda de cambio es la confianza.
            Nos comprometemos a:
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="bg-navbar/50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-100 text-base mb-1">
                Feedback Abierto
              </h4>
              <p className="text-sm text-gray-400">
                Las métricas de la escuela serán compartidas con la comunidad
                cada trimestre.
              </p>
            </div>
            <div className="bg-navbar/50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-100 text-base mb-1">
                Currículo Adaptativo
              </h4>
              <p className="text-sm text-gray-400">
                Si un curso necesita un cambio por tendencias de mercado, lo
                haremos rápidamente, sin burocracia.
              </p>
            </div>
            <div className="bg-navbar/50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-100 text-base mb-1">
                Política de Devolución
              </h4>
              <p className="text-sm text-gray-400">
                Ofreceremos una política de devolución de dinero clara y sin
                preguntas para nuestros primeros alumnos.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center pt-10 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-yellow-light">
            Conoce a los Fundadores
          </h2>

          <p className="text-base text-gray-300 max-w-3xl mx-auto mb-8">
            Somos un equipo pequeño y accesible. Tu comunicación será
            directamente con nosotros, los que construimos DevCore día a día.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-navbar rounded-lg hover:shadow-lg-white border border-gray-700">
              <h4 className="text-base font-semibold text-gray-100">
                CEO / Visionario
              </h4>
              <p className="text-yellow-light text-sm mb-1">Dr. Alex Rivera</p>
              <p className="text-xs text-gray-400">
                “El momento de cambiar la educación es ahora. Únete a nuestro
                movimiento.”
              </p>
            </div>

            <div className="p-4 bg-navbar rounded-lg hover:shadow-lg-white border border-gray-700">
              <h4 className="text-base font-semibold text-gray-100">
                Jefe de Tecnología (CTO)
              </h4>
              <p className="text-yellow-light text-sm mb-1">
                Ing. Valeria Soto
              </p>
              <p className="text-xs text-gray-400">
                “Solo enseñamos lo que se usa en las grandes empresas de Silicon
                Valley.”
              </p>
            </div>

            <div className="p-4 bg-navbar rounded-lg hover:shadow-lg-white border border-gray-700">
              <h4 className="text-base font-semibold text-gray-100">
                Líder de Comunidad
              </h4>
              <p className="text-yellow-light text-sm mb-1">
                Lic. Marcos Rivas
              </p>
              <p className="text-xs text-gray-400">
                “Nuestra generosidad de conocimiento es lo que nos diferencia.”
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyPage;

// kk
