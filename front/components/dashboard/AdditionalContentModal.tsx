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

const AdditionalContentModal: React.FC<AdditionalContentModalProps> = ({
  isOpen,
  onClose,
}) => {
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

  const selectedCourseData = courses.find(
    (course) => course.id === selectedCourse
  );
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
        className="bg-[#2a2d3a] rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <HiLink className="text-blue-400 text-xl" />
            <h2 className="text-xl font-bold text-font-light">
              Agregar Contenido Adicional
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selector de Curso */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Seleccionar Curso
            </label>
            {coursesLoading ? (
              <div className="bg-slate-800/50 rounded-lg p-3 text-slate-400">
                Cargando cursos...
              </div>
            ) : (
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedLesson(""); // Reset lesson when course changes
                }}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selector de Lección */}
          {selectedCourse && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Seleccionar Lección
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una lección</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* URLs Input */}
          {selectedLesson && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                URLs de Contenido Adicional
              </label>
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://ejemplo.com/recurso"
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUrlField(index)}
                        className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 rounded-lg px-3 transition-colors"
                      >
                        <HiTrash className="text-lg" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addUrlField}
                className="mt-3 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <HiPlus className="text-sm" />
                Agregar otra URL
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !selectedLesson ||
              isSubmitting ||
              urls.every((url) => url.trim() === "")
            }
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-font-light rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
