//Context
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/UserContext";
//Alerts
import { toastError } from "@/helpers/alerts.helper";
//Services
import { removeFromCartService } from "@/services/cart.service";
//Types
import { Course } from "@/types/course.types";
//React
import { useState } from "react";

export const useRemoveFromCart = () => {
  const { token, isLoading } = useAuth();
  const { removeFromCart } = useCart();
  const [loadingRemove, setLoadingRemove] = useState<string | null>(null);
  const handleRemoveFromCart = async (course: Course) => {
    if (isLoading) {
      toastError("Cargando sesión...");
      return;
    }
    if (!token) {
      toastError("Debes tener una cuenta");
      return;
    }

    try {
      setLoadingRemove(course.id);
      await removeFromCart(course.id);
    } catch (error) {
      console.log();
      throw error;
    } finally {
      setLoadingRemove(null);
    }
  };
  return { handleRemoveFromCart, loadingRemove };
};
