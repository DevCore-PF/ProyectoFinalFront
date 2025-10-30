"use client";
import { getAllCoursesService } from "@/services/course.service";
import { useEffect, useState } from "react";
interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  difficulty: string;
}

const Page = () => {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCoursesService();
        console.log("Esta es la data que recibo en mi courses", data);
        setCoursesList(data);
      } catch (error: any) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div>Cargando cursos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Cursos disponibles</h1>
      <ul>
        {coursesList.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Precio: ${item.price}</p>
            <p>Duración: {item.duration}</p>
            <p>Dificultad: {item.difficulty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
