"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiX, HiLink, HiPlus, HiTrash } from "react-icons/hi";
import { useAuth } from "@/context/UserContext";
import { useProfessorCourses } from "@/hooks/useProfessorCourses";
import { Course } from "@/types/course.types";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";

interface AdditionalContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdditionalContentModal: React.FC<AdditionalContentModalProps> = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { courses, isLoading: coursesLoading } = useProfessorCourses();

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedCourseData = courses.find((course) => course.id === selectedCourse);
  const lessons = selectedCourseData?.lessons || [];

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async () => {
    if (!selectedLesson || !token) return;

    const validUrls = urls.filter((url) => url.trim() !== "");
    if (validUrls.length === 0) {
      toastError("Debes agregar al menos una URL válida");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/aditionalData/${selectedLesson}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(validUrls),
        }
      );

      if (!response.ok) {
        throw new Error("Error al agregar contenido adicional");
      }

      toastSuccess("Contenido adicional agregado exitosamente");
      onClose();
      // Reset form
      setSelectedCourse("");
      setSelectedLesson("");
      setUrls([""]);
    } catch (error) {
      console.error("Error:", error);
      toastError("Error al agregar contenido adicional");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#2a2d3a] rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform scale-100 animate-in fade-in duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <HiLink className="text-blue-400 text-lg sm:text-xl flex-shrink-0" />
            <h2 className="text-base sm:text-xl font-bold text-font-light truncate">
              Agregar Contenido Adicional
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer flex-shrink-0 ml-2"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Selector de Curso */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Seleccionar Curso
            </label>
            {coursesLoading ? (
              <div className="bg-slate-800/50 rounded-lg p-3 text-slate-400 text-sm">Cargando cursos...</div>
            ) : (
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedLesson(""); // Reset lesson when course changes
                }}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                  fontSize: "0.813rem",
                }}
              >
                <option value="" style={{ fontSize: "0.813rem" }}>
                  Selecciona un curso
                </option>
                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                    title={course.title}
                    style={{ fontSize: "0.813rem" }}
                  >
                    {course.title.length > 35 ? `${course.title.substring(0, 35)}...` : course.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selector de Lección */}
          {selectedCourse && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                Seleccionar Lección
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                  fontSize: "0.813rem",
                }}
              >
                <option value="" style={{ fontSize: "0.813rem" }}>
                  Selecciona una lección
                </option>
                {lessons.map((lesson) => (
                  <option
                    key={lesson.id}
                    value={lesson.id}
                    title={lesson.title}
                    style={{ fontSize: "0.813rem" }}
                  >
                    {lesson.title.length > 35 ? `${lesson.title.substring(0, 35)}...` : lesson.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* URLs Input */}
          {selectedLesson && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                URLs de Contenido Adicional
              </label>
              <div className="space-y-2 sm:space-y-3">
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://ejemplo.com/recurso"
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUrlField(index)}
                        className="bg-amber-600/20 cursor-pointer text-amber-400 hover:bg-amber-600/30 rounded-lg px-3 transition-colors flex-shrink-0"
                      >
                        <HiTrash className="text-base sm:text-lg" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addUrlField}
                className="mt-2 sm:mt-3 flex items-center gap-2 text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <HiPlus className="text-sm flex-shrink-0" />
                <span>Agregar otra URL</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedLesson || isSubmitting || urls.every((url) => url.trim() === "")}
            className="px-4 sm:px-6 py-2 bg-button/80 cursor-pointer hover:bg-button text-font-light rounded-lg hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-1 sm:order-2"
          >
            {isSubmitting ? "Agregando..." : "Agregar Contenido"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AdditionalContentModal;
