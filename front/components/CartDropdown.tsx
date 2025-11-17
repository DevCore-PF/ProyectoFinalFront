"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  HiShoppingCart,
  HiX,
  HiArrowRight,
  HiChevronUp,
  HiChevronDown,
  HiClock,
  HiAcademicCap,
} from "react-icons/hi";
import { toastConfirm } from "@/helpers/alerts.helper";
import { usePathname } from "next/navigation";
import { useRemoveFromCart } from "@/hooks/useRemoveFromCart";
import { Course } from "@/types/course.types";
import TinyLoader from "./Loaders/TinyLoader";
export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { cart, getTotal } = useCart();
  const pathname = usePathname();
  const { loadingRemove, handleRemoveFromCart } = useRemoveFromCart();
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 5);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkScrollPosition();
      const scrollElement = scrollRef.current;
      scrollElement?.addEventListener("scroll", checkScrollPosition);

      return () => {
        scrollElement?.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [isOpen, cart]);

  const startScrolling = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "up" ? -30 : 30;
      scrollRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });

      scrollIntervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleSingleScroll = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "up" ? -100 : 100;
      scrollRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  const handleRemove = (course: Course) => {
    toastConfirm("¿Eliminar este curso?", async () => {
      await handleRemoveFromCart(course);
    });
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative  hover:bg-background cursor-pointer animate  hover:text-font-light px-3 py-2 rounded-md transition-all duration-200 group"
      >
        {cart.length > 0 ? (
          <>
            <HiShoppingCart className=" mr-1.5 flex w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="absolute pr-2 top-4 -right-1  text-amber-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {cart.length}
            </span>
          </>
        ) : (
          <HiShoppingCart className="  flex w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background2 backdrop-blur-lg border border-slate-200/20 rounded-xl shadow-2xl z-50 max-h-[500px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/40 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <HiShoppingCart className="w-5 h-5 text-accent-light" />
              <h3 className="font-bold text-lg text-slate-200">Mi Carrito</h3>
              {cart.length > 0 && (
                <span className="bg-background/80 text-accent-light px-2 py-0.5 rounded-full text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-700/50 cursor-pointer p-1.5 rounded-md transition-colors duration-200 text-slate-400 hover:text-slate-200"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
                <HiShoppingCart className="w-8 h-8 text-accent-light/70" />
              </div>
              <p className="text-slate-400 mb-4 font-medium">
                Tu carrito está vacío
              </p>
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 cursor-pointer bg-button hover:bg-button/80 text-font-light px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm hover:scale-105 active:scale-95"
              >
                <HiAcademicCap className="w-4 h-4" />
                <span>Ver Cursos</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="relative flex-1 flex">
                <div
                  ref={scrollRef}
                  className="overflow-y-auto p-3 space-y-3 max-h-[300px] flex-1 scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {cart.map((course) => (
                    <div
                      key={course.id}
                      className={`group relative flex gap-3 p-3 bg-background rounded-lg transition-all duration-200 ${
                        loadingRemove === course.id
                          ? "opacity-60 pointer-events-none"
                          : "hover:bg-background/80"
                      }`}
                    >
                      {loadingRemove === course.id && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                          <div className="flex flex-col items-center gap-2">
                            <TinyLoader />
                            <span className="text-font-light text-sm">
                              Eliminando...
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-2 text-slate-200 group-hover:text-font-light transition-colors duration-200">
                            {course.title}
                          </h4>
                          <button
                            disabled={loadingRemove === course.id}
                            onClick={() => handleRemove(course)}
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <HiX className="w-5.5 h-5.5 cursor-pointer hover:scale-110 hover:bg-background2 p-1 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-100" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <HiAcademicCap className="w-3 h-3" />
                            {course.difficulty}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <HiClock className="w-3 h-3" />
                            {course.duration}
                          </span>
                        </div>

                        <p className="text-sm text-accent-light font-bold tabular-nums">
                          ${Number(course.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 2 && (
                  <div className="flex flex-col justify-center gap-2 pr-2">
                    <button
                      onMouseDown={() => startScrolling("up")}
                      onMouseUp={stopScrolling}
                      onMouseLeave={stopScrolling}
                      onClick={() => handleSingleScroll("up")}
                      disabled={!canScrollUp}
                      className={`p-2 justify-center flex rounded-lg transition-all duration-200 ${
                        canScrollUp
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-font-light cursor-pointer"
                          : "bg-slate-800/20 text-slate-600 cursor-not-allowed opacity-40"
                      }`}
                    >
                      <HiChevronUp className="w-4 h-4" />
                    </button>

                    <button
                      onMouseDown={() => startScrolling("down")}
                      onMouseUp={stopScrolling}
                      onMouseLeave={stopScrolling}
                      onClick={() => handleSingleScroll("down")}
                      disabled={!canScrollDown}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        canScrollDown
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-font-light cursor-pointer"
                          : "bg-slate-800/20 text-slate-600 cursor-not-allowed opacity-40"
                      }`}
                    >
                      <HiChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {/*
                 */}
              </div>

              <div className="border-t border-slate-200/50 p-4 space-y-3 bg-slate-900/80">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">Total:</span>
                  <span className="font-bold text-xl text-accent-light tabular-nums">
                    ${Number(getTotal()).toFixed(2)}
                  </span>
                </div>
                <Link
                  href={pathname === "/cart" ? "/courses" : "/cart"}
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center justify-center gap-2 w-full bg-button hover:bg-button/80 py-3 rounded-lg font-semibold transition-all duration-200 text-font-light hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/25"
                >
                  {pathname !== "/cart" ? (
                    <span>Ver Carrito Completo</span>
                  ) : (
                    <span>Continuar comprando</span>
                  )}
                  <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
