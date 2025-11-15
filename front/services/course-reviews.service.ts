const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CourseReview {
  id: string;
  rating: number;
  feedback: string;
  createdAt: string;
  // Campos de moderación
  isCensored: boolean;
  moderationStatus: 'approved' | 'pending' | 'censored' | 'rejected';
  toxicityScore?: number;
  moderationReason?: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export const courseReviewsService = {
  /**
   * Obtiene todas las reseñas de un curso
   */
  async getCourseReviews(courseId: string): Promise<CourseReview[]> {
    try {
      const response = await fetch(`${API_URL}/course-feedback/${courseId}/feedbacks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las reseñas del curso');
      }

      return await response.json();
    } catch (error) {
      console.error('Error courseReviewsService.getCourseReviews:', error);
      throw error;
    }
  },

  /**
   * Calcula el promedio de rating de las reseñas
   */
  calculateAverageRating(reviews: CourseReview[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Redondear a 1 decimal
  },

  /**
   * Cuenta las reseñas por rating
   */
  countReviewsByRating(reviews: CourseReview[]): Record<number, number> {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating] = (counts[review.rating] || 0) + 1;
      }
    });
    return counts;
  },
};