// src/context/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./UserContext";
import {
  addToCartService,
  clearCartService,
  getCartService,
  removeFromCartService,
} from "@/services/cart.service";
import { Course } from "@/types/course.types";
import { JwtPayload } from "@/types/auth.types";

interface CartContextType {
  cart: Course[];
  loading: boolean;
  addToCart: (course: Course) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [user, token]);

  const refreshCart = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const data = await getCartService(token);
      setCart(data.courses || []);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (course: Course) => {
    if (!token) {
      throw new Error("No hay sesión activa");
    }

    try {
      const data = await addToCartService(token, course.id);

      await refreshCart();

      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (courseId: string) => {
    if (!token) throw new Error("No hay sesión activa");

    try {
      await removeFromCartService(token, courseId);
      setCart((prev) => prev.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error("Error al quitar del carrito:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!token) {
      // No token available
      return;
    }

    try {
      await clearCartService(token);
      setCart([]);
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
      throw error;
    }
  };
  const getTotal = () => {
    return cart.reduce((sum, course) => sum + Number(course.price), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};
