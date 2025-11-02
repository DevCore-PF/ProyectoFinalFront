"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/UserContext";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
import { getAllCoursesService } from "@/services/course.service";
import { Course } from "@/types/courses.types";
import { useEffect, useState } from "react";

const Page = () => {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCoursesService();
        setCoursesList(data);
      } catch (error: any) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
        console.error("   Mensaje del error:", error.message);
        toastError(error.message);
      } else {
        console.error("   Error desconocido:", error);
        toastError("Error desconocido");
      }
    }
  };
  if (loading) return <div>Cargando cursos...</div>;

  return (
    <div>
      <h1>Cursos disponibles</h1>
      <ul>
        {coursesList.map((item: Course) => (
          <ul
            key={item.id}
            className="border m-3 flex justify-center items-center gap-2"
          >
            <li className="">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Precio: ${item.price}</p>
              <p>Duración: {item.duration}</p>
              <p>Dificultad: {item.difficulty}</p>
              <p>ID: {item.id}</p>
            </li>
            <button
              onClick={() => handleAddToCart(item)}
              className="cursor-pointer h-8 border px-2 rounded-2xl"
            >
              Add to cart
            </button>
          </ul>
        ))}
      </ul>
    </div>
  );
};

export default Page;
