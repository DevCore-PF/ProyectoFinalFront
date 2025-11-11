import { Course } from "@/types/course.types";
import { User } from "@/types/user.types";

export const downloadCSV = (users: User[]) => {
  // Headers del CSV
  const headers = ["ID", "Nombre", "Email", "Rol", "Estado", "Fecha Creación"];

  // Convertir usuarios a filas
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.isActive ? "Activo" : "Inactivo",
    new Date(user.createdAt).toLocaleDateString(),
  ]);

  // Crear contenido CSV
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Descargar archivo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `usuarios_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// export const downloadCourses = (courses:Course) => {
//   // Headers del CSV
//   const headers = ["ID", "Nombre", "Email", "Rol", "Estado", "Fecha Creación"];

//   // Convertir usuarios a filas
//   const rows = courses.map((course) => [
//     user.id,
//     user.name,
//     user.email,
//     user.role,
//     user.isActive ? "Activo" : "Inactivo",
//     new Date(user.createdAt).toLocaleDateString(),
//   ]);

//   // Crear contenido CSV
//   const csvContent = [
//     headers.join(","),
//     ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
//   ].join("\n");

//   // Descargar archivo
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);

//   link.setAttribute("href", url);
//   link.setAttribute(
//     "download",
//     `usuarios_${new Date().toISOString().split("T")[0]}.csv`
//   );
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };