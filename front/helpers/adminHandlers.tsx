import { Sale } from "@/types/admin.types";
import { Course } from "@/types/course.types";
import { User } from "@/types/user.types";

export const downloadUsers = (users: User[]) => {
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

export const downloadCourses = (courses: Course[]) => {
  // Headers del CSV
  const headers = [
    "ID",
    "Curso",
    "Profesor",
    "Categoría",
    "Rating",
    "Estado",
    "Fecha de creación",
    "Precio",
  ];

  const rows = courses.map((course) => [
    course.id,
    course.title,
    course.professor?.user?.name,
    course.category,
    course.isActive ? "Activo" : "Inactivo",
    course.status,
    course.createdAt,
    course.price,
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
    `cursos_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadSalesHistory = (sales: Sale[]) => {
  const headers = [
    "ID",
    "Fecha de compra",
    "Titulo de curso",
    "Nombre de alumno",
    "Email de alumno",
    "Nombre de profesor",
    "Total de venta",
    "Ganancias de profesor",
    "Ganancias de admin",
    "ID de pago",
    "Id de Stripe",
    "Estado de pago",
  ];

  const rows = sales.map((sale) => [
    sale.saleID,
    sale.saleDate,
    sale.courseTitle,
    sale.studentName,
    sale.studentEmail,
    sale.professorName,
    sale.totalPrice,
    sale.professorEarnings,
    sale.adminEarnings,
    sale.paymentId,
    sale.stripeID,
    sale.payoutStatus,
    new Date(sale.saleDate).toLocaleDateString(),
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
    `ventas_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
