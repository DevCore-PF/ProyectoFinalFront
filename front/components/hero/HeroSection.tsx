import CreativityBadge from "./CreativityBadge";
import EmailSubscription from "./EmailSubscription";
import Image from "next/image";

const HeroSection = () => {
  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 text-center pt-12 sm:pt-16 lg:pt-20">
            <div className="mb-4 sm:mb-6">
              <CreativityBadge />
            </div>

            <h1 className="text-white mb-1 leading-[150%] text-center tracking-normal font-medium text-xl sm:text-3xl lg:text-4xl xl:text-5xl px-4">
              Con formación online en diseño y desarrollo.
            </h1>

            <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl text-center font-normal font-body text-sm sm:text-base lg:text-lg px-4">
              Aprende con expertos de la industria y lleva las habilidades al
              siguiente nivel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto px-4 max-w-md sm:max-w-none">
              <button className="px-6 sm:px-8 py-3 bg-button/90 hover:bg-button text-font-ligh font-semibold rounded-lg transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95">
                Explorar cursos
              </button>
              <button className="px-6 sm:px-8 py-3 bg-font-light text-font-dark/80 text-sm md:text-base hover:bg-gray-100 hover:text-button font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg">
                Ver Planes
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-8 lg:px-16">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20 max-w-7xl w-full">
              <div className="w-full max-w-md relative z-20 text-center lg:text-left px-4 sm:px-0 order-2 lg:order-1">
                <h2 className="text-white mb-2 font-medium font-body text-xl sm:text-2xl lg:text-3xl xl:text-[32px]">
                  Fórmate en tecnología.
                </h2>

                <h3 className="text-white mb-4 sm:mb-6 font-medium font-body text-xl sm:text-2xl lg:text-3xl xl:text-[32px]">
                  Crea tu futuro.
                </h3>

                <EmailSubscription />
              </div>

              <div className="hidden lg:block relative w-[400px] md:w-[450px] lg:w-[500px] h-80 lg:h-150 shrink-0 order-1 lg:order-2">
                <div className="absolute -left-5 bottom-15 z-20">
                  <div className="relative">
                    <Image
                      src="/images/imgHeroUp.png"
                      alt="Mobile Development"
                      width={250}
                      height={320}
                      className="object-contain"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/25 rounded-2xl"></div>
                  </div>
                </div>

                <div className="absolute -right-15 top-15 z-10">
                  <div className="relative">
                    <Image
                      src="/images/imgHero.png"
                      alt="Laptop Development"
                      width={460}
                      height={340}
                      className="object-contain"
                      priority
                    />
                    <div className="absolute bottom-4 left-0 right-4">
                      <p className="text-yellow-200 font-mono w-fit font-semibold  rounded-lg p-3 lg:p-4 text-sm lg:text-lg ">
                        <span className="text-lg font-body">&lt;</span>Tu
                        próxima lección
                        <br />
                        <span className="ml-4 lg:ml-5">
                          al alcance de tu mano
                          <span className="text-base font-body">
                            /<span className="text-lg font-body">&gt;</span>
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
