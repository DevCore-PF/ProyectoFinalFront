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
} from "react-icons/hi";

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { cart, getTotal } = useCart();

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Detectar si se puede hacer scroll
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

  // Scroll continuo al mantener presionado
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

  // Scroll único al hacer click
  const handleSingleScroll = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "up" ? -100 : 100;
      scrollRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-background cursor-pointer hover:text-font-light p-3 rounded-md transition-colors duration-200 group"
      >
        <HiShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute bottom-1 right-1 text-amber-300 text-xs font-title font-bold">
            {cart.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-navbar/50 backdrop-blur-sm border border-border-light/80 rounded-lg shadow-xl z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg">Mi Carrito</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-background p-1 rounded-md transition-colors duration-200"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido */}
          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <HiShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="inline-block hover:bg-button px-4 py-2 rounded-md transition-colors duration-200"
              >
                Ver Cursos
              </Link>
            </div>
          ) : (
            <>
              {/* Lista de productos con scroll personalizado */}
              <div className="relative flex-1 flex">
                <div
                  ref={scrollRef}
                  className="overflow-y-auto p-4 space-y-3 max-h-[300px] flex-1 scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {cart.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-3 p-3 bg-background/90 rounded-lg hover:bg-background transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0 flex justify-between">
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                            {course.title}
                          </h4>
                          <p className="text-xs text-gray-400 mb-2">
                            {course.difficulty} • {course.duration}
                          </p>
                        </div>
                        <p className=" text-sm text-accent-light font-medium">
                          ${`${Number(course.price).toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center gap-2 pr-2">
                  <button
                    onMouseDown={() => startScrolling("up")}
                    onMouseUp={stopScrolling}
                    onMouseLeave={stopScrolling}
                    onClick={() => handleSingleScroll("up")}
                    disabled={!canScrollUp}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      canScrollUp
                        ? "bg-background/50 hover:bg-background text-gray-300 hover:text-font-light cursor-pointer"
                        : "bg-background/20 text-gray-600  opacity-40"
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
                    className={`p-2 rounded-md transition-all duration-200 ${
                      canScrollDown
                        ? "bg-background/50 hover:bg-background text-gray-300 hover:text-font-light cursor-pointer"
                        : "bg-background/20 text-gray-600  opacity-40"
                    }`}
                  >
                    <HiChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg">
                    `${Number(getTotal()).toFixed(2)}` $
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-button hover:bg-button/80 py-3 rounded-md font-semibold transition-colors duration-200"
                >
                  <span>Ver Carrito Completo</span>
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
