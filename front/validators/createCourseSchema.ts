import * as Yup from "yup";
import {
  CourseDifficulty,
  CourseCategory,
  CourseType,
} from "@/types/course.types";
export const createCourseSchema = Yup.object({
  title: Yup.string()
    .required("El título es requerido")
    .min(5, "Mínimo 5 caracteres")
    .max(100, "Máximo 100 caracteres"),

  description: Yup.string()
    .required("La descripción es requerida")
    .min(20, "Mínimo 20 caracteres")
    .max(500, "Máximo 500 caracteres"),

  price: Yup.number()
    .required("El precio es requerido")
    .positive("El precio debe ser mayor a 0")
    .max(999, "El precio no puede ser mayor a $999")
    .typeError("Debes ingresar un precio válido"),

  duration: Yup.string()
    .required("La duración es requerida")
    .matches(
      /^\d+h\s?\d*m?$|^\d+\s?horas?$|^\d+h$/,
      'Formato: "4h 30m" o "25h" o "2 horas"'
    ),

  difficulty: Yup.string()
    .required("La dificultad es requerida")
    .oneOf(Object.values(CourseDifficulty)),

  category: Yup.string()
    .required("La categoría es requerida")
    .oneOf(Object.values(CourseCategory)),

  type: Yup.string()
    .required("El tipo es requerido")
    .oneOf(Object.values(CourseType)),
});

export const createCourseInitialValues = {
  title: "",
  description: "",
  price: 0,
  duration: "",
  difficulty: CourseDifficulty.BEGINNER,
  category: CourseCategory.FRONTEND,
  type: CourseType.COURSE,
};

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB en bytes
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB en bytes
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];
const ALLOWED_PDF_TYPE = "application/pdf";

export const lessonSchema = Yup.object({
  title: Yup.string()
    .required("El título de la lección es requerido")
    .min(5, "Mínimo 5 caracteres")
    .max(100, "Máximo 100 caracteres"),

  videos: Yup.array()
    .min(1, "Debes subir al menos 1 video por lección")
    .max(3, "Máximo 3 videos por lección")
    .required("Al menos 1 video es requerido")
    .test(
      "fileSize",
      "Uno o más videos exceden el tamaño máximo de 50 MB",
      (files) => {
        if (!files) return true;
        return files.every((file: File) => file.size <= MAX_VIDEO_SIZE);
      }
    )
    .test("fileType", "Uno o más archivos no son videos válidos", (files) => {
      if (!files) return true;
      return files.every((file: File) =>
        ALLOWED_VIDEO_TYPES.includes(file.type)
      );
    }),

  pdfs: Yup.array()
    .min(1, "Debes subir al menos 1 PDF por lección")
    .max(3, "Máximo 3 PDFs por lección")
    .required("Al menos 1 PDF es requerido")
    .test(
      "fileSize",
      "Uno o más PDFs exceden el tamaño máximo de 10 MB",
      (files) => {
        if (!files) return true;
        return files.every((file: File) => file.size <= MAX_PDF_SIZE);
      }
    )
    .test("fileType", "Uno o más archivos no son PDFs válidos", (files) => {
      if (!files) return true;
      return files.every((file: File) => file.type === ALLOWED_PDF_TYPE);
    }),
});