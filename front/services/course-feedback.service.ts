const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CourseFeedbackRequest {
  rating: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
}

export interface CourseFeedbackResponse {
  id: string;
  rating: number;
  feedback?: string;
  createdAt: string;
  message?: string; // Mensaje del backend sobre la moderación
  moderation?: {
    isCensored: boolean;
    requiresReview: boolean;
  };
  user: {
    id: string;
    name: string;
  };
}

export const courseFeedbackService = {
  
  async submitCourseFeedback(
    courseId: string, 
    feedbackData: CourseFeedbackRequest, 
    token: string
  ): Promise<CourseFeedbackResponse> {
    try {
      const response = await fetch(`${API_URL}/course-feedback/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar feedback');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitCourseFeedback:', error);
      throw error;
    }
  },

  // Verificar si el usuario ya envió feedback para este curso
  async hasUserFeedback(courseId: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/course-feedback/${courseId}/user-feedback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        return false; // No existe feedback del usuario
      }

      if (!response.ok) {
        throw new Error('Error al verificar feedback del usuario');
      }

      const data = await response.json();
      return data.hasFeedback === true;
    } catch (error) {
      console.error('Error hasUserFeedback:', error);
      return false; // En caso de error, permitir mostrar el feedback
    }
  },

  
  async getCourseFeedbacks(courseId: string, token?: string) {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/course-feedback/${courseId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al obtener feedbacks del curso');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getCourseFeedbacks:', error);
      throw error;
    }
  }
};