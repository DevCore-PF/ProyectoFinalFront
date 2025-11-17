"use client";
//Next/Rect
import { useState } from "react";
import { useRouter } from "next/navigation";
//Formik
import { useFormik } from "formik";
//Context
import { useAuth } from "@/context/UserContext";
//Services
import { createCourseService } from "@/services/course.services";
//Alerts
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
//Helpers
import {
  CreateCourseFormData,
  CourseDifficulty,
  CourseType,
} from "@/types/course.types";
import {
  createCourseInitialValues,
  createCourseSchema,
} from "@/validators/createCourseSchema";
import { categoryOptions, getCategoryConfig } from "@/helpers/course.helpers";
//Icons
import { FaExclamation } from "react-icons/fa6";
import { HiArrowLeft, HiBookOpen } from "react-icons/hi";

const CreateCoursePage = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<CreateCourseFormData>({
    initialValues: createCourseInitialValues,
    validationSchema: createCourseSchema,
    onSubmit: async (values) => {
      const professorProfile = user?.professorProfile;

      if (!professorProfile || !professorProfile.id || !token) {
        toastError("Error: No se encontró el perfil de profesor");
        return;
      }

      try {
        setIsSubmitting(true);
        const courseResponse = await createCourseService(
          professorProfile.id,
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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-accent-medium/20 rounded-xl">
              <HiBookOpen className="w-8 h-8 text-accent-light" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold">
                Crear Nuevo Curso
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Comparte tu conocimiento con miles de estudiantes
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="border border-border p-8 rounded-2xl shadow-lg">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm mb-1">
                Título del Curso *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Ej: Introducción a React y TypeScript"
                {...formik.getFieldProps("title")}
                className={`w-full h-12 rounded-md bg-background2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                  formik.touched.title && formik.errors.title
                    ? "border border-amber-400/50"
                    : ""
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.title}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm mb-1">
                Descripción *
              </label>
              <textarea
                id="description"
                rows={4}
                maxLength={500}
                placeholder="Describe qué aprenderán los estudiantes en tu curso..."
                {...formik.getFieldProps("description")}
                className={`w-full rounded-md bg-background2 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 resize-none ${
                  formik.touched.description && formik.errors.description
                    ? "border border-amber-400/50"
                    : ""
                }`}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.description}</span>
                  </p>
                </div>
              )}
              <p
                className={`text-sm flex justify-end mr-2 ${
                  formik.values.description.length === 500
                    ? "text-orange-400"
                    : formik.values.description.length >= 450
                    ? "text-yellow-200"
                    : "text-font-light/50"
                }`}
              >
                {formik.values.description.length}/500
              </p>
            </div>

            {/* Fila de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precio */}
              <div>
                <label htmlFor="price" className="block text-sm mb-1">
                  Precio (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    className={`w-full h-12 pl-8 pr-4 rounded-md bg-background2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.price && formik.errors.price
                        ? "border border-amber-400/50"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.price && formik.errors.price && (
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.price}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Duración */}
              <div>
                <label htmlFor="duration" className="block text-sm mb-1">
                  Duración *
                </label>
                <input
                  id="duration"
                  type="text"
                  placeholder="Ej: 4h 30m, 25h, 2 horas"
                  {...formik.getFieldProps("duration")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.duration && formik.errors.duration
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.touched.duration && formik.errors.duration && (
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.duration}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Categoría con preview */}
            <div>
              <label htmlFor="category" className="block text-sm mb-1">
                Categoría *
              </label>
              <div className="space-y-3">
                <select
                  id="category"
                  {...formik.getFieldProps("category")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.category && formik.errors.category
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

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
                    <selectedCategoryConfig.icon className="w-5 h-5 text-font-light" />
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
                  <span className="text-gray-400 text-sm ml-auto">
                    Vista previa de la categoría
                  </span>
                </div>
              </div>
              {formik.touched.category && formik.errors.category && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.category}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Fila de selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dificultad */}
              <div>
                <label htmlFor="difficulty" className="block text-sm mb-1">
                  Dificultad *
                </label>
                <select
                  id="difficulty"
                  {...formik.getFieldProps("difficulty")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.difficulty && formik.errors.difficulty
                      ? "border border-amber-400/50"
                      : ""
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
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.difficulty}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label htmlFor="type" className="block text-sm mb-1">
                  Tipo *
                </label>
                <select
                  id="type"
                  {...formik.getFieldProps("type")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.type && formik.errors.type
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                >
                  <option value={CourseType.COURSE}>Curso</option>
                  <option value={CourseType.CAREER}>Carrera</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.type}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-gray-400 cursor-pointer hover:text-gray-200 font-medium transition-colors w-full sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-button/90 hover:bg-button transition rounded-md py-2 font-semibold w-full sm:w-auto px-6 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creando..." : "Crear Curso y Continuar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
