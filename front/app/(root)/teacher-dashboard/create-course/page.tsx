"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/UserContext";
import { createCourseService } from "@/services/course.services";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import {
  CreateCourseFormData,
  CourseDifficulty,
  CourseCategory,
  CourseType,
} from "@/types/course.types";
import { categoryOptions, getCategoryConfig } from "@/helpers/course.helpers";
import { HiArrowLeft, HiBookOpen, HiSparkles } from "react-icons/hi";

// Esquema de validación
const validationSchema = Yup.object({
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
    .min(0, "El precio debe ser mayor o igual a 0")
    .max(999, "El precio no puede ser mayor a $999"),

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

const CreateCoursePage = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<CreateCourseFormData>({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      duration: "",
      difficulty: CourseDifficulty.BEGINNER,
      category: CourseCategory.FRONTEND,
      type: CourseType.COURSE,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user?.professorProfile?.id || !token) {
        toastError("Error: No se encontró el perfil de profesor");
        return;
      }
      console.log(
        "Este es mi profesor profile id desde create curso",
        user.professorProfile.id
      );

      try {
        setIsSubmitting(true);

        const courseResponse = await createCourseService(
          user.professorProfile.id,
          values,
          token
        );

        toastSuccess("¡Curso creado exitosamente!");

        // Redirigir a crear lecciones para este curso
        router.push(
          `/teacher-dashboard/create-course/${courseResponse.id}/lessons`
        );
      } catch (error) {
        console.error("Error creating course:", error);
        toastError(
          error instanceof Error ? error.message : "Error al crear el curso"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const selectedCategoryConfig = getCategoryConfig(formik.values.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background2 to-background3 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-accent-medium/20 rounded-xl">
              <HiBookOpen className="w-8 h-8 text-accent-light" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Crear Nuevo Curso
              </h1>
              <p className="text-slate-400">
                Comparte tu conocimiento con miles de estudiantes
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-background2/40 border border-slate-700/50 rounded-2xl p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Título del Curso *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Ej: Introducción a React y TypeScript"
                {...formik.getFieldProps("title")}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 hover:border-slate-500"
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.title}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Descripción *
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe qué aprenderán los estudiantes en tu curso..."
                {...formik.getFieldProps("description")}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 resize-none ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 hover:border-slate-500"
                }`}
              />
              <div className="flex justify-between mt-1">
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-400 text-sm">
                    {formik.errors.description}
                  </p>
                )}
                <p className="text-slate-500 text-sm ml-auto">
                  {formik.values.description.length}/500
                </p>
              </div>
            </div>

            {/* Fila de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precio */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Precio (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999"
                    placeholder="49.99"
                    {...formik.getFieldProps("price")}
                    className={`w-full pl-8 pr-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                      formik.touched.price && formik.errors.price
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  />
                </div>
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-400 text-sm mt-1">
                    {formik.errors.price}
                  </p>
                )}
              </div>

              {/* Duración */}
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Duración *
                </label>
                <input
                  id="duration"
                  type="text"
                  placeholder="Ej: 4h 30m, 25h, 2 horas"
                  {...formik.getFieldProps("duration")}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                    formik.touched.duration && formik.errors.duration
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                />
                {formik.touched.duration && formik.errors.duration && (
                  <p className="text-red-400 text-sm mt-1">
                    {formik.errors.duration}
                  </p>
                )}
              </div>
            </div>

            {/* Categoría con preview */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Categoría *
              </label>
              <div className="space-y-3">
                <select
                  id="category"
                  {...formik.getFieldProps("category")}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                    formik.touched.category && formik.errors.category
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Preview de la categoría */}
                <div
                  className={`
                  flex items-center gap-3 p-3 rounded-lg border
                  bg-gradient-to-r ${selectedCategoryConfig.gradient}
                  ${selectedCategoryConfig.badgeColor}
                `}
                >
                  <div
                    className={`
                    p-2 rounded-lg bg-gradient-to-r ${selectedCategoryConfig.iconGradient}
                  `}
                  >
                    <selectedCategoryConfig.icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`font-medium ${selectedCategoryConfig.textColor}`}
                  >
                    {
                      categoryOptions.find(
                        (opt) => opt.value === formik.values.category
                      )?.label
                    }
                  </span>
                  <span className="text-slate-400 text-sm ml-auto">
                    Vista previa de la categoría
                  </span>
                </div>
              </div>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.category}
                </p>
              )}
            </div>

            {/* Fila de selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dificultad */}
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Dificultad *
                </label>
                <select
                  id="difficulty"
                  {...formik.getFieldProps("difficulty")}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                    formik.touched.difficulty && formik.errors.difficulty
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <option value={CourseDifficulty.BEGINNER}>
                    Principiante
                  </option>
                  <option value={CourseDifficulty.INTERMEDIATE}>
                    Intermedio
                  </option>
                  <option value={CourseDifficulty.ADVANCED}>Avanzado</option>
                </select>
                {formik.touched.difficulty && formik.errors.difficulty && (
                  <p className="text-red-400 text-sm mt-1">
                    {formik.errors.difficulty}
                  </p>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Tipo *
                </label>
                <select
                  id="type"
                  {...formik.getFieldProps("type")}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                    formik.touched.type && formik.errors.type
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-slate-600 hover:border-slate-500"
                  }`}
                >
                  <option value={CourseType.COURSE}>Curso</option>
                  <option value={CourseType.CAREER}>Carrera</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <p className="text-red-400 text-sm mt-1">
                    {formik.errors.type}
                  </p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-slate-400 hover:text-slate-200 font-medium transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !formik.isValid}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-medium to-accent-light text-white font-medium rounded-lg hover:from-accent-light hover:to-accent-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-4 h-4" />
                    Crear Curso y Continuar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
