// src/app/cart/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation"; 
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const cart = [
    {
      id: "1",
      title: "titulo 1",
      price: 123456,
      thumbnail: "thumbnail",
      instructor: "maria Perez",
    },
    {
      id: "2",
      title: "titulo 2",
      price: 123456,
      thumbnail: "thumbnail",
      instructor: "maria Perez",
    },
    {
      id: "3",
      title: "titulo 3",
      price: 123456,
      thumbnail: "thumbnail",
      instructor: "maria Perez",
    },
  ];

  // const { cart, loading, getTotal } = useCart();
  const router = useRouter(); // Cambio importante

  // if (loading) {
  //   return <div className="p-8">Cargando carrito...</div>;
  // }

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button
          onClick={() => router.push("/courses")} // Cambio importante
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Ver Cursos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>

      <div className="space-y-4">
        {cart.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              {course.instructor && (
                <p className="text-gray-600 text-sm">Por {course.instructor}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">
                ${course.price.toFixed(2)}
              </span>
              <button
                // onClick={() => removeFromCart(course.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          {/* <span className="text-2xl font-bold">${getTotal().toFixed(2)}</span> */}
        </div>
        <button
          onClick={() => router.push("/checkout")} // Cambio importante
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          Proceder al Pago
        </button>
      </div>
    </div>
  );
}
