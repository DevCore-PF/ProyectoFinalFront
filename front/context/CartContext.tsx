// src/context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './UserContext';
import { addToCartService, getCart } from '@/services/cart.service';


interface Course {
  id: string;
  title: string;
  price: number;
  thumbnail?: string;
  instructor?: string;
}

interface CartContextType {
  cart: Course[];
  loading: boolean;
  addToCart: (course: Course) => Promise<void>;
//   removeFromCart: (courseId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
  getTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth(); // Usamos el token del AuthContext

  // Cargar el carrito cuando el usuario inicie sesión
  useEffect(() => {
    if (user && token) {
      refreshCart();
    } else {
      setCart([]); // Limpiar carrito si no hay usuario
    }
  }, [user, token]);

  const refreshCart = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const data = await getCart(token);
      setCart(data.courses || []);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (course: Course) => {
    if (!token) throw new Error('No hay sesión activa');
    
    try {
      await addToCartService(token, course.id);
      setCart(prev => [...prev, course]);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  };

//   const removeFromCart = async (courseId: string) => {
//     if (!token) throw new Error('No hay sesión activa');
    
//     try {
//       await cartService.removeFromCart(token, courseId);
//       setCart(prev => prev.filter(c => c.id !== courseId));
//     } catch (error) {
//       console.error('Error al quitar del carrito:', error);
//       throw error;
//     }
//   };

//   const clearCart = async () => {
//     if (!token) return;
    
//     try {
//       await cartService.clearCart(token);
//       setCart([]);
//     } catch (error) {
//       console.error('Error al limpiar el carrito:', error);
//       throw error;
//     }
//   };

  const getTotal = () => {
    return cart.reduce((sum, course) => sum + course.price, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        // removeFromCart,
        // clearCart,
        getTotal,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};