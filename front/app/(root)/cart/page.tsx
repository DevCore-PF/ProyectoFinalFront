"use client";
//Next/React
import { useEffect } from "react";
import { useRouter } from "next/navigation";
//Context
import { useCart } from "@/context/CartContext";
//Icons
import {
  HiShoppingCart,
  HiTrash,
  HiArrowRight,
  HiCreditCard,
} from "react-icons/hi";
import { FaInfinity } from "react-icons/fa";
//Helpers
import { toastConfirm } from "@/helpers/alerts.helper";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, getTotal, refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);
  const router = useRouter();
  const handleRemove = (id: string) => {
    toastConfirm("Eliminar", async () => {
      try {
        await removeFromCart(id);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  };
  const handleClear = () => {
    toastConfirm("Eliminar carrito", () => clearCart());
  };
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 bg-slate-800/50 border-2 border-slate-700/50 rounded-full flex items-center justify-center">
              <HiShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-slate-500" />
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-font-light mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-8">
              Explora nuestros cursos y comienza tu aprendizaje
            </p>

            <button
              onClick={() => router.push("/courses")}
              className="group cursor-pointer inline-flex items-center gap-3 bg-button hover:bg-button/80 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25"
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
    <div className="min-h-screen p-4 sm:p-8 lg:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-font-light mb-4">
            Mi Carrito
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            {cart.length} {cart.length === 1 ? "curso" : "cursos"} en tu carrito
          </p>
          {cart.length >= 3 && (
            <div className="mt-4 p-4 bg-button/20 rounded-lg">
              <p className="text-slate-200 text-sm md:text-base flex items-center gap-2">
                <span>
                  ¿Sabías que con una{" "}
                  <Link
                    href="/plans"
                    className="text-accent-medium hover:text-accent-light hover:underline "
                  >
                    membresía
                  </Link>{" "}
                  tendrías acceso ilimitado a estos y más de 100 cursos?{" "}
                  <Link
                    href="/plans"
                    className="text-accent-medium hover:text-accent-light hover:underline "
                  >
                    Conoce más
                  </Link>
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((course, index) => (
              <div
                key={course.id}
                className="group bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-button/20 border border-button/30 text-button font-bold text-lg">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg md:text-xl text-slate-200 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      {/* {course.instructor && (
                        <p className="text-slate-400 text-sm mb-3">
                          Por {course.instructor}
                        </p>
                      )} */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-bold text-xl md:text-2xl text-slate-200 tabular-nums">
                          ${Number(course.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemove(course.id)}
                          className="group/btn cursor-pointer flex items-center gap-2 text-red-300 hover:text-red-200 text-sm font-medium transition-colors duration-200"
                        >
                          <HiTrash className=" w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-6">
                Resumen
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700/50">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold tabular-nums">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Descuento:</span>
                  <span className="font-semibold text-green-400">-$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-700/50">
                <span className="text-xl font-bold text-slate-200">Total:</span>
                <span className="text-2xl md:text-3xl font-bold text-slate-200 tabular-nums">
                  ${getTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="group w-full cursor-pointer bg-button hover:bg-button/80 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-3 mb-4"
              >
                <HiCreditCard className="w-5 h-5" />
                <span>Proceder al Pago</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/courses")}
                  className="w-full cursor-pointer bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 text-slate-200 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Continuar comprando
                </button>
                <button
                  onClick={() => handleClear()}
                  className=" cursor-pointer bg-amber-900/50 hover:bg-amber-900/70 border border-amber-500/50 hover:border-amber-400/50 text-amber-400 p-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Limpiar
                </button>
              </div>

              <div className="mt-6 p-4  bg-button/10 border border-button/30 rounded-xl">
                <p className="text-slate-300 text-sm text-center">
                  🔒 Pago seguro con Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
