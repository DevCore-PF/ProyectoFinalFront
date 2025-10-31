"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { createCheckoutSession } from "@/services/payments.service";
import { getAllCoursesService } from "@/services/course.service";
import { Course } from "@/types/courses.types";
import { HiShoppingCart, HiArrowLeft, HiCheckCircle } from "react-icons/hi";

export default function CheckoutPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        ////////////////////////aca despues usaria el cart
        const data = await getAllCoursesService();
        setCourses(data);
      } catch (error: any) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCheckout = async () => {
    if (!token) {
      setError("No hay sesión activa");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const courseIds = courses.map((course) => course.id);
      const { url } = await createCheckoutSession(token, courseIds);
      window.location.href = url;
    } catch (err: any) {
      console.error("Error al crear sesión de pago:", err);
      setError(err.message || "Error al procesar el pago");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 lg:p-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
            Confirmar Compra
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Revisa tu orden antes de proceder al pago
          </p>
        </div>

        {loading && courses.length === 0 ? (
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button"></div>
              <p className="text-slate-300 text-lg">Cargando cursos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-6 shadow-xl hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <HiShoppingCart className="w-6 h-6 text-button" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-200">
                  Resumen de la Orden
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-button/20 text-button font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-slate-200 font-medium text-sm md:text-base">
                        {course.title}
                      </span>
                    </div>
                    {/* <span className="text-slate-300 font-semibold text-sm md:text-base tabular-nums">
                      ${course.price.toFixed(2)}
                    </span> */}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700/50 pt-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-button/10 border border-button/30">
                  <span className="text-slate-200 text-lg md:text-xl font-bold">
                    Total:
                  </span>
                  <span className="text-slate-200 text-xl md:text-2xl font-bold tabular-nums">
                    $
                    {/* {courses
                      .reduce((sum, course) => sum + course.price, 0)
                      .toFixed(2)} */}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/40 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-xs font-bold">!</span>
                  </div>
                </div>
                <p className="text-red-200 text-sm md:text-base">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                disabled={loading || courses.length === 0}
                className="group w-full bg-button hover:bg-button/80 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-6 h-6" />
                    <span>Pagar con Stripe</span>
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="group w-full bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 text-slate-200 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Volver al Carrito</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
