"use client";
//Next/React
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//Context
import { useCart } from "@/context/CartContext";
//Icons
import { HiShoppingCart, HiTrash, HiArrowRight, HiCreditCard, HiClock, HiAcademicCap } from "react-icons/hi";
//Helpers
import { toastConfirm } from "@/helpers/alerts.helper";
import Link from "next/link";
import Loader from "@/components/Loaders/Loader";
import { useRemoveFromCart } from "@/hooks/useRemoveFromCart";
import { Course } from "@/types/course.types";
import TinyLoader from "@/components/Loaders/TinyLoader";

export default function CartPage() {
  const { cart, clearCart, getTotal, refreshCart, loading } = useCart();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [loadingClear, setLoadingClear] = useState(false);
  const { loadingRemove, handleRemoveFromCart } = useRemoveFromCart();
  const router = useRouter();

  useEffect(() => {
    refreshCart();
  }, []);

  const toggleDescription = (courseId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleRemove = (course: Course) => {
    toastConfirm("¿Eliminar este curso?", async () => {
      await handleRemoveFromCart(course);
    });
  };

  const handleClear = () => {
    toastConfirm("Eliminar carrito", async () => {
      try {
        setLoadingClear(true);
        await clearCart();
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoadingClear(false);
      }
    });
  };

  if (loading)
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <Loader size="medium" />
        <p className="text-slate-400">Cargando...</p>
      </div>
    );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 bg-slate-800/50 border-2 border-slate-700/50 rounded-full flex items-center justify-center">
              <HiShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-slate-500" />
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-font-light mb-4">Tu carrito está vacío</h2>
            <p className="text-slate-300 text-base md:text-lg mb-8">
              Explora nuestros cursos y comienza tu aprendizaje
            </p>

            <button
              onClick={() => router.push("/courses")}
              className="group cursor-pointer inline-flex items-center gap-3 bg-button hover:bg-button/80 text-font-light px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25"
            >
              <span>Ver Cursos</span>
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-font-light mb-3 md:mb-4">
            Mi Carrito
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            {cart.length} {cart.length === 1 ? "curso" : "cursos"} en tu carrito
          </p>
          {cart.length >= 3 && (
            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-button/20 rounded-lg border border-button/30">
              <p className="text-slate-200 text-xs sm:text-sm md:text-base">
                💡 ¿Sabías que con una{" "}
                <Link
                  href="/plans"
                  className="text-accent-medium hover:text-accent-light hover:underline font-semibold"
                >
                  membresía
                </Link>{" "}
                tendrías acceso ilimitado a estos y más de 100 cursos?{" "}
                <Link
                  href="/plans"
                  className="text-accent-medium hover:text-accent-light hover:underline font-semibold"
                >
                  Conoce más →
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {loadingClear ? (
              <div className="flex justify-center items-center py-20">
                <Loader size="medium" />
              </div>
            ) : (
              <>
                {cart.map((course, index) => {
                  const isExpanded = expandedDescriptions.has(course.id);
                  const needsTruncation = course.description && course.description.length > 120;

                  return (
                    <div
                      key={course.id}
                      className="relative group bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-slate-600/50 transition-all duration-300 shadow-xl"
                    >
                      {loadingRemove === course.id && (
                        <div className="absolute inset-0 bg-background/80 border border-slate-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                          <div className="flex flex-col items-center gap-2">
                            <TinyLoader />
                            <span className="text-font-light text-xs sm:text-sm">Eliminando...</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 md:gap-4 mb-3">
                   
                       

                        <h3 className="flex-1 font-semibold text-base sm:text-lg md:text-xl text-slate-200 line-clamp-2 min-w-0">
                          {course.title}
                        </h3>

                        <button
                          onClick={() => handleRemove(course)}
                          className="group/btn cursor-pointer flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 bg-amber-900/20 hover:bg-amber-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-amber-500/30"
                        >
                          <HiTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>

                      {course.description && (
                        <div className="mb-3 ml-0 w-[90%]">
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                            {isExpanded ? course.description : truncateText(course.description)}
                          </p>
                          {needsTruncation && (
                            <button
                              onClick={() => toggleDescription(course.id)}
                              className="text-accent-medium/90 hover:text-accent-light/90 cursor-pointer text-xs sm:text-sm font-medium mt-1 transition-colors"
                            >
                              {isExpanded ? "Ver menos" : "Ver más"}
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 ml-0 ">
                    
                        <div className="flex flex-wrap items-center gap-2">
                          {course.duration && (
                            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-800/50 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-700/50">
                              <HiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                              <span className="text-xs font-medium">{course.duration}</span>
                            </div>
                          )}
                          {course.difficulty && (
                            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-800/50 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-700/50">
                              <HiAcademicCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                              <span className="text-xs font-medium capitalize">{course.difficulty}</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <span className="font-bold text-xl sm:text-2xl md:text-2xl text-emerald-300 tabular-nums">
                          ${Number(course.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 md:top-8 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 shadow-xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-200 mb-4 md:mb-6">
                Resumen
              </h2>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-700/50">
                <div className="flex justify-between text-slate-300 text-sm md:text-base">
                  <span>Subtotal:</span>
                  <span className="font-semibold tabular-nums">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5 md:mb-6 pb-5 md:pb-6 border-b border-slate-700/50">
                <span className="text-lg md:text-xl font-bold text-slate-200">Total:</span>
                <span className="text-2xl md:text-3xl font-bold text-emerald-300 tabular-nums">
                  ${getTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="group w-full cursor-pointer bg-button hover:bg-button/80 text-font-light py-3 md:py-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4"
              >
                <HiCreditCard className="w-4 h-4 md:w-5 md:h-5" />
                <span>Proceder al Pago</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/courses")}
                  className="flex-1 cursor-pointer bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 text-slate-200 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Continuar
                </button>
                <button
                  onClick={() => handleClear()}
                  className="cursor-pointer bg-amber-900/50 hover:bg-amber-900/70 border border-amber-500/50 hover:border-amber-400/50 text-amber-400 p-2.5 md:p-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  title="Limpiar carrito"
                >
                  <HiTrash className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-button/10 border border-button/30 rounded-lg md:rounded-xl">
                <p className="text-slate-300 text-xs md:text-sm text-center">🔒 Pago seguro con Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
