"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { toastError } from "@/helpers/alerts.helper";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const selectedCourses = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000", // Reemplaza con IDs reales
      title: "Curso de React Avanzado",
      price: 99.99,
      description: "Aprende React con hooks y contextos",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      title: "Curso de Node.js",
      price: 89.99,
      description: "Backend con Express y TypeScript",
    },
  ];

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    const { token, isLoading } = useAuth();//puedo user el is loading de mi conetext
    try {
      // 1. Obtener el token del usuario (ajusta según tu sistema de auth)

      if (!token) {
        toastError("Debes iniciar sesión para continuar");
        setLoading(false);
        return;
      }

      // 2. Extraer solo los IDs (UUIDs) de los cursos
      const courseIds = selectedCourses.map((course) => course.id);

      // 3. Llamar al endpoint del backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseIds: courseIds,
          }),
        }
      );

      // 4. Parsear la respuesta
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la sesión de pago");
      }

      // 5. Redirigir a la URL de Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió la URL de pago");
      }
    } catch (err: any) {
      console.error("Error en checkout:", err);
      setError(err.message || "Error al procesar el pago");
      setLoading(false);
    }
  };

  const totalAmount = selectedCourses.reduce(
    (sum, course) => sum + course.price,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Carrito de compra</h1>
          <p className="text-gray-600 mb-8">
            Revisa tu selección antes de proceder al pago
          </p>

          {/* Lista de cursos */}
          <div className="space-y-4 mb-6">
            {selectedCourses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="text-xl font-bold text-blue-600">
                      ${course.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center mt-2">
              <span className="text-2xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalAmount.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "🔒 Proceder al pago seguro"}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Serás redirigido a Stripe para completar tu compra
          </p>
        </div>
      </div>
    </div>
  );
}
