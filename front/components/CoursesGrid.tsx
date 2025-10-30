"use client";
import { useAuth } from "@/context/UserContext";
//Next
import { courses } from "@/helpers/moks";
import { paymentService } from "@/services/payment.service";
import { CourseCardProps } from "@/types/courses.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
//Incos
import { IoArrowForward } from "react-icons/io5";

const CoursesGrid = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  // const handleBuyCourse = async () => {
  //   // Verificar autenticación
  //   if (!token || !user) {
  //     router.push("/login");
  //     return;
  //   }

  //   try {
  //     // Llamar al backend para crear la sesión de Stripe
  //     const data = await paymentService.createCheckoutSession(token, [
  //       course.id,
  //     ]);

  //     // Redirigir a Stripe
  //     if (data.url) {
  //       window.location.href = data.url;
  //     }
  //   } catch (err: any) {
  //     console.log(err.message);
  //   }
  // };
  return (
    <div className="min-h-screen p-20" id="courses">
      <div className="max-w-7xl mx-auto">
        <div className=" mb-12">
          <h2 className="text-2xl md:text-5xl font-bold text-font-light mb-4">
            Explora Nuestros Cursos
          </h2>
          <p className="hidden md:block text-slate-300 text-lg  ">
            Descubre una amplia variedad de cursos y rutas profesionales
            diseñadas para impulsar tu carrera en tecnología
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="group bg-accent-medium/8 backdrop-blur-xs border border-slate-700/50 rounded-2xl p-6 hover:border-border-light/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-background2/70 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${course.bgColor} p-3 rounded-xl`}>
                    <Icon className={`text-2xl ${course.iconColor}`} />
                  </div>
                  <span
                    className={`${
                      course.careerPath ? "bg-button/60" : "bg-slate-700"
                    } text-font-light text-xs px-3 py-1 rounded-full md:font-semibold`}
                  >
                    <span className="md:hidden">
                      {course.category.slice(0, 9) + "."}
                    </span>
                    <span className="hidden md:inline">{course.category}</span>
                  </span>
                </div>

                <h3 className="text-font-light text-2xl font-bold mb-3">
                  {course.title}
                </h3>

                <p className="hidden md:block text-slate-300 text-sm leading-relaxed mb-4 grow">
                  {course.description}
                </p>

                {course.techs && (
                  <div className="flex gap-2 mb-4 pt-4 border-t border-slate-700/50 overflow-hidden">
                    {course.techs.map((TechIcon, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 p-2 rounded-lg"
                      >
                        <TechIcon className="text-xl text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end mt-auto">
                  {/* <button onClick={handleBuyCourse}>Comprar</button> */}
                  <Link
                    href={`/courses/${course.id}`}
                    className="bg-slate-600/90 p-3 rounded-lg  transition-all duration-300 hover:shadow-slate-800 hover:shadow-md hover:bg-slate-600/40"
                  >
                    <IoArrowForward className="text-slate-300 text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesGrid;
