//Next/React
import Link from "next/link";
import Image from "next/image";
//Icons
import {
  FaGraduationCap,
  FaHandsHelping,
  FaLightbulb,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const teamMembers = [
  {
    name: "Jesús Anaya",
    role: "Ingeniero Principal de APIs",
    image:
      "https://res.cloudinary.com/dtbpi3bic/image/upload/v1763505222/JesusProfilePhoto_zb3pax.jpg",
    linkedin: "https://www.linkedin.com/in/jesusanaya2022/",
    github: "https://github.com/JesusAnayaMtz",
  },
  {
    name: "Gonzalo Moreiro",
    role: "Arquitecto de Sistemas",
    image:
      "https://res.cloudinary.com/dtbpi3bic/image/upload/v1763435601/GonzaProfilePhoto01_dmgdy6.webp",
    linkedin: "https://www.linkedin.com/in/gonzalo-moreiro-b0b00a363/",
    github: "https://github.com/GonzaloMoreiro",
  },
  {
    name: "Laura Mussa",
    role: "Líder de Ingeniería Front-end",
    image:
      "https://res.cloudinary.com/dtbpi3bic/image/upload/v1763505453/LauraProfilePhoto_zshbly.jpg",
    linkedin:
      "https://www.linkedin.com/in/laura-mussa-rodr%C3%ADguez-a439a2171/",
    github: "https://github.com/LauraMussa",
  },
  {
    name: "Diego Marzioni",
    role: "Especialista en Experiencia de Usuario (UX)",
    image:
      "https://res.cloudinary.com/dtbpi3bic/image/upload/v1763481498/diegoProfilePhoto_wlpooq.jpg",
    linkedin: "https://www.linkedin.com/in/diego-marzioni/",
    github: "https://github.com/DiegoMarzioni",
  },
  {
    name: "Adán Franco",
    role: "Desarrollador Front-end",
    image:
      "https://res.cloudinary.com/dtbpi3bic/image/upload/v1763435206/01-Yo_stcdci.webp",
    linkedin: "https://www.linkedin.com/in/adanlfranco/",
    github: "https://github.com/AdanLFranco",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen text-gray-100 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-4 sm:mb-6">
            <span className="text-font-light font-semibold text-sm sm:text-base lg:text-lg">
              Somos DevCore
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-light mb-4 px-4">
            Transformamos la mentalidad <br />
            <span className="text-accent-medium">Impulsamos Carreras.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            El código es nuestra herramienta, pero la{" "}
            <strong>comunidad </strong> y el <strong> apoyo </strong>
            son nuestra metodología.
          </p>
        </header>

        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-light">
                La "chispa" que encendió DevCore ...
              </h2>
              <p className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4">
                DevCore nació de la frustración que sentimos con la educación
                técnica tradicional: cursos teóricos, desactualizados y
                desconectados de las demandas reales del mercado.
              </p>
              <p className="text-sm sm:text-base text-gray-200">
                Nuestra misión es simple: ser el "puente entre la curiosidad y
                la empleabilidad". Creamos un ecosistema de aprendizaje
                intensivo, práctico y, sobre todo, humano, que te prepara para
                el rol de desarrollador desde el día uno.
              </p>
            </div>

            <div className="order-1 md:order-2">
              <Image
                alt="Image of developers collaborating"
                src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761782525/aboutsImage_xw35hg.webp"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-light px-4">
            Nosotros: El Equipo{" "}
            <strong className="text-accent-medium">DevCore</strong>
          </h2>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-navbar p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700 hover:border-button transition-all duration-300 flex flex-col items-center hover:text-accent-medium"
              >
                <Image
                  src={member.image}
                  alt={`Foto de ${member.name}`}
                  width={128}
                  height={128}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-3 border-2 border-yellow-light/50"
                />
                <h3 className="text-base sm:text-xl font-semibold text-gray-light mb-1 text-center">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 text-center">{member.role}</p>
                <div className="flex space-x-3">
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-font-light transition-colors"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <FaLinkedin size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-font-light transition-colors"
                    aria-label={`GitHub de ${member.name}`}
                  >
                    <FaGithub size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-gray-light px-4">
            Nuestra Filosofía: Código con Propósito
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-navbar p-4 sm:p-6 rounded-lg shadow-xl border border-gray-700 hover:border-yellow-light transition-all duration-300">
              <FaLightbulb
                size={32}
                className="text-yellow-light mx-auto mb-4 w-8 h-8 sm:w-8 sm:h-8"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Aprender Haciendo</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Nuestros cursos son 80% práctica. Trabajarás en proyectos reales
                para construir un portafolio sólido y demostrar tu dominio
                técnico real.
              </p>
            </div>

            <div className="bg-navbar p-4 sm:p-6 rounded-lg shadow-xl border border-gray-700 hover:border-yellow-light transition-all duration-300">
              <FaHandsHelping
                size={32}
                className="text-yellow-light mx-auto mb-4 w-8 h-8 sm:w-8 sm:h-8"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Comunidad Inclusiva
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Fomentamos un ambiente de apoyo constante. Nuestros mentores son
                generosos con su tiempo y conocimiento para guiarte en cada
                desafío.
              </p>
            </div>

            <div className="bg-navbar p-4 sm:p-6 rounded-lg shadow-xl border border-gray-700 hover:border-yellow-light transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <FaGraduationCap
                size={32}
                className="text-yellow-light mx-auto mb-4 w-8 h-8 sm:w-8 sm:h-8"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Dominio Avanzado</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Nos enfocamos en tecnologías de vanguardia para prepararte para
                el rol de Desarrollador Júnior/Intermedio con el conocimiento
                más fresco del mercado.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center pt-6 sm:pt-8 pb-8 sm:pb-10 border-t border-gray-700 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-100">
            ¿Listo para construir tu{" "}
            <strong className="text-accent-medium">futuro</strong> con DevCore?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6">
            Únete a la comunidad que te da las herramientas y el soporte para
            triunfar.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/courses"
              className="border border-font-light/10 bg-navbar text-font-light font-bold rounded-md px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:bg-button transition-colors"
            >
              Explorar Cursos
            </Link>
            <Link
              href="/contact-us"
              className="border border-font-light/10 bg-navbar text-font-light font-bold rounded-md px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:bg-button transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
