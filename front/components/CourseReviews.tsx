"use client";
import React, { useEffect, useState } from 'react';
import { CourseReview, courseReviewsService } from '@/services/course-reviews.service';
import { HiStar, HiUser } from 'react-icons/hi';
import Loader from '@/components/Loaders/Loader';

interface CourseReviewsProps {
  courseId: string;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const courseReviews = await courseReviewsService.getCourseReviews(courseId);
        setReviews(courseReviews);
        setError(null);
      } catch (err) {
        console.error('Error cargando reseñas:', err);
        setError('Error al cargar las reseñas');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <HiStar
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400' : 'text-slate-600'
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
        <div className="text-center text-red-400">
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
              {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <HiStar
                key={index}
                className={`w-5 h-5 ${
                  index < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-600'
                }`}
                fill="currentColor"
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-slate-100">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-slate-400 text-sm">
            de 5 estrellas
          </span>
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
                
                <div className="mb-3">
                  {renderStars(review.rating)}
                </div>
                
                {/* Contenido de la reseña */}
                {review.feedback && (
                  <div className="text-slate-300 text-sm leading-relaxed">
                    <p className="break-words">{review.feedback}</p>
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