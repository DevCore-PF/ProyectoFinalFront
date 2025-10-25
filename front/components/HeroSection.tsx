import CreativityBadge from "./CreativityBadge";
import EmailSubscription from "./EmailSubscription";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-background) 0%, var(--color-background2) 50%, var(--color-navbar) 100%)",
      }}
    >
      {/* 🎨 HERO BACKGROUND - REUTILIZABLE PARA OTRAS VIEWS 
          Gradiente: Usa las variables CSS del globals.css
          - var(--color-background): #242645 (azul oscuro)
          - var(--color-background2): #3f4273 (azul medio) 
          - var(--color-navbar): #363968 (azul-púrpura)
          Dirección: 135deg (diagonal) */}

      {/* 🔲 GRID PATTERN - Patrón de cuadrícula superpuesto
          - Líneas blancas semi-transparentes (5% opacidad)
          - Tamaño de grid: 50px x 50px
          - Se puede reutilizar en cualquier sección */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-16 text-center pt-20">
          <div className="mb-6">
            <CreativityBadge />
          </div>

          <h1
            className="text-white mb-6 leading-[150%] text-center tracking-normal font-medium"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(24px, 4vw, 38px)",
            }}
          >
            Con formación online en diseño y desarrollo.
          </h1>

          <p
            className="text-gray-300 mb-8 max-w-2xl text-center font-normal"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 2vw, 18px)",
            }}
          >
            Aprendé con expertos de la industria y forjá las habilidades al
            siguiente nivel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95">
              Explorar cursos
            </button>
            <button className="px-8 py-3 bg-white text-black hover:bg-gray-100 hover:text-purple-700 font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg">
              Ver Planes
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center pb-20 px-8 lg:px-16">
          <div className="flex items-center justify-center gap-20 max-w-7xl w-full">
            <div className="w-full max-w-md relative z-20">
              <h2
                className="text-white mb-2 font-medium"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(20px, 3vw, 32px)",
                }}
              >
                Formate en tecnología.
              </h2>
              <h3
                className="text-white mb-6 font-medium"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(20px, 3vw, 32px)",
                }}
              >
                Creá tu futuro.
              </h3>

              <EmailSubscription />
            </div>

            <div className="relative w-[500px] h-96">
              <div className="absolute left-0 bottom-4 z-20">
                <Image
                  src="/images/imgHeroUp.png"
                  alt="Mobile Development"
                  width={200}
                  height={320}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="absolute right-0 top-0 z-10">
                <Image
                  src="/images/imgHero.png"
                  alt="Laptop Development"
                  width={450}
                  height={340}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
