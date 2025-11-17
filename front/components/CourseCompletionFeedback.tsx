"use client";

import React, { useState } from "react";
import {
  courseFeedbackService,
  CourseFeedbackRequest,
} from "@/services/course-feedback.service";
import { useAuth } from "@/context/UserContext";
import { HiStar, HiCheck, HiHeart } from "react-icons/hi";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";

interface CourseCompletionFeedbackProps {
  courseId: string;
  courseTitle: string;
  onFeedbackSubmitted: () => void;
  onCancel?: () => void;
}

export const CourseCompletionFeedback: React.FC<
  CourseCompletionFeedbackProps
> = ({ courseId, courseTitle, onFeedbackSubmitted, onCancel }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!token || rating === 0) {
      toastError("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData: CourseFeedbackRequest = {
        rating: rating as 1 | 2 | 3 | 4 | 5,
        feedback: feedback.trim() || undefined,
      };

      await courseFeedbackService.submitCourseFeedback(
        courseId,
        feedbackData,
        token
      );
      setSubmitted(true);
      toastSuccess("¡Gracias por tu feedback!");

      // Llamar callback para informar que se envió el feedback
      onFeedbackSubmitted();
      
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      // Mostrar el mensaje específico del backend si existe
      const errorMessage = error?.message || 'Error al enviar el feedback. Inténtalo de nuevo.';
      toastError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setSubmitted(true);
    onFeedbackSubmitted();
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheck className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-2">
          ¡Feedback enviado!
        </h3>
        <p className="text-green-300">
          Tu opinión nos ayuda a mejorar continuamente nuestros cursos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
      {/* Header con celebración */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-font-light mb-2">
          ¡Felicitaciones!
        </h2>
        <p className="text-gray-300">
          Has completado exitosamente el curso{" "}
          <span className="font-semibold text-blue-400">
            &ldquo;{courseTitle}&rdquo;
          </span>
        </p>
      </div>

      {/* Sección de calificación */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-font-light mb-4 flex items-center gap-2">
          <HiHeart className="w-5 h-5 text-amber-400" />
          ¿Cómo calificarías este curso?
        </h3>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
              disabled={isSubmitting}
            >
              <HiStar
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-600"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-gray-400">
            {rating === 1 && "Necesita mucho trabajo"}
            {rating === 2 && "Podría mejorar"}
            {rating === 3 && "Estuvo bien"}
            {rating === 4 && "Muy bueno"}
            {rating === 5 && "¡Excelente!"}
          </p>
        )}
      </div>

      {/* Sección de comentarios */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-font-light mb-4">
          Cuéntanos tu experiencia (opcional)
        </h3>
        <textarea
          value={feedback}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFeedback(e.target.value)
          }
          placeholder="¿Qué fue lo que más te gustó del curso? ¿Alguna sugerencia de mejora?"
          rows={4}
          disabled={isSubmitting}
          className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-font-light placeholder-gray-400 transition-colors"
          maxLength={500}
        />
        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-500">
            {feedback.length}/500 caracteres
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onCancel || handleSkip}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border border-slate-600/50 text-gray-300 rounded-xl hover:bg-slate-700/30 transition-colors disabled:opacity-50 font-medium cursor-pointer"
        >
          {onCancel ? "Cancelar" : "Omitir por ahora"}
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : (
            <>
              <HiHeart className="w-4 h-4" />
              Enviar feedback
            </>
          )}
        </button>
      </div>
    </div>
  );
};
