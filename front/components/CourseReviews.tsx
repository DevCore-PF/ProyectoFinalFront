"use client";
import React, { useEffect, useState } from "react";
import {
  CourseReview,
  courseReviewsService,
} from "@/services/course-reviews.service";
import {
  HiStar,
  HiUser,
  HiExclamationCircle,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";

interface CourseReviewsProps {
  courseId: string;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCensoredIds, setVisibleCensoredIds] = useState<Set<string>>(
    new Set()
  );
  const [unblurredCensoredIds, setUnblurredCensoredIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const courseReviews = await courseReviewsService.getCourseReviews(
          courseId
        );
        setReviews(courseReviews);
        setError(null);
      } catch (err) {
        console.error("Error cargando reseñas:", err);
        setError("Error al cargar las reseñas");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  const toggleCensoredVisibility = (reviewId: string) => {
    setVisibleCensoredIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const unblurCensoredContent = (reviewId: string) => {
    setUnblurredCensoredIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(reviewId);
      return newSet;
    });
  };

  const isCensoredVisible = (reviewId: string) =>
    visibleCensoredIds.has(reviewId);

  const isCensoredUnblurred = (reviewId: string) =>
    unblurredCensoredIds.has(reviewId);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <HiStar
            key={index}
            className={`w-4 h-4 ${
              index < rating ? "text-yellow-400" : "text-slate-600"
            }`}
            fill="currentColor"
          />
        ))}
        <span className="ml-2 text-sm text-slate-300 font-medium">
          {rating}/5
        </span>
      </div>
    );
  };

  const averageRating = courseReviewsService.calculateAverageRating(reviews);

  if (loading) {
    return (
      <div className="mt-12 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center text-amber-400">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-12 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiStar className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Sin reseñas aún
          </h3>
          <p className="text-slate-400">
            Sé el primero en dejar una reseña de este curso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
      {/* Header con estadísticas */}
      <div className="mb-8 pb-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-yellow-500/10 rounded-lg">
            <HiStar className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">
              Reseñas de Estudiantes
            </h3>
            <p className="text-sm text-slate-400">
              {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <HiStar
                key={index}
                className={`w-5 h-5 ${
                  index < Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-slate-600"
                }`}
                fill="currentColor"
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-slate-100">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-slate-400 text-sm">de 5 estrellas</span>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300"
          >
            {/* Header de la reseña */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-700/50 border-2 border-slate-600/50 flex items-center justify-center">
                    <HiUser className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-200 truncate">
                    {review.user.name}
                  </h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <div className="mb-3">{renderStars(review.rating)}</div>

                {/* Contenido de la reseña */}
                {review.feedback && (
                  <div className="mt-3">
                    {/* Caso 1: Feedback censurado y NO visible */}
                    {review.isCensored && !isCensoredVisible(review.id) ? (
                      <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-3 sm:p-4 overflow-hidden">
                        <div className="flex items-start gap-2 sm:gap-3 mb-3">
                          <HiExclamationCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-amber-300 font-semibold text-xs sm:text-sm mb-1 break-words">
                              Contenido moderado por lenguaje inapropiado
                            </p>
                            <p className="text-amber-200/80 text-xs break-words">
                              Este comentario ha sido identificado como
                              potencialmente ofensivo y ha sido censurado
                              automáticamente.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleCensoredVisibility(review.id)}
                          className="flex items-center justify-center cursor-pointer gap-2 px-3 sm:px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-amber-200 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium w-full sm:w-auto"
                        >
                          <HiEye className="w-4 h-4" />
                          <span className="whitespace-nowrap">Ver contenido</span>
                        </button>
                      </div>
                    ) : (
                      /* Caso 2: Feedback normal o censurado pero visible */
                      <div>
                        {review.isCensored && (
                          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2">
                              <HiExclamationCircle className="w-4 h-4 text-yellow-400" />
                              <p className="text-yellow-300 text-xs font-medium">
                                ⚠️ Este contenido ha sido marcado como
                                inapropiado
                              </p>
                            </div>
                          </div>
                        )}
                        <div
                          onClick={() => {
                            if (review.isCensored && isCensoredVisible(review.id) && !isCensoredUnblurred(review.id)) {
                              unblurCensoredContent(review.id);
                            }
                          }}
                          className={`text-slate-300 text-sm leading-relaxed ${
                            review.isCensored && isCensoredVisible(review.id) && !isCensoredUnblurred(review.id)
                              ? "blur-sm cursor-pointer transition-all duration-300"
                              : ""
                          }`}
                        >
                          <p className="break-words">{review.feedback}</p>
                        </div>
                        {review.isCensored && isCensoredVisible(review.id) && (
                          <button
                            onClick={() => toggleCensoredVisibility(review.id)}
                            className="flex items-center cursor-pointer gap-2 mt-3 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-amber-200 rounded-lg transition-all duration-200 text-xs font-medium"
                          >
                            <HiEyeOff className="w-3.5 h-3.5" />
                            Ocultar contenido
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseReviews;
