// src/hooks/useAddToCart.ts
import { Course } from "@/types/courses.types";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/UserContext";

export const useAddToCart = () => {
  const { addToCart, cart } = useCart();
  const { token, isLoading } = useAuth();

  const handleAddToCart = async (course: Course) => {
    if (isLoading) {
      toastError("Cargando sesión...");
      return;
    }
    if (!token) {
      toastError("Debes tener una cuenta");
      return;
    }
    const alreadyInCart = cart.some((c) => c.id === course.id);
    if (alreadyInCart) {
      toastError("Este curso ya está en tu carrito");
      return;
    }

    try {
      await addToCart(course);
      toastSuccess("Curso agregado!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Mensaje del error:", error.message);
        toastError(error.message);
      } else {
        console.error("Error desconocido:", error);
        toastError("Error desconocido");
      }
    }
  };

  return { handleAddToCart };
};