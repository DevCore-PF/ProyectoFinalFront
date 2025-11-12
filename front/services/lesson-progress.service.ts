const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompletedLessonsResponse {
  courseId: string;
  totalCompleted: number;
  lessons: Array<{
    id: string;
    title: string;
  }>;
}

export interface ProgressResponse {
  message?: string;
  courseId?: string;
  totalCompleted?: number;
  lessons?: Array<{
    id: string;
    title: string;
  }>;
}

export const lessonProgressService = {
  
  async markLessonCompleted(lessonId: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/lesson-progress/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al marcar lección como completada');
      }

      return await response.json();
    } catch (error) {
      console.error('Error markLessonCompleted:', error);
      throw error;
    }
  },

  
  async getCompletedLessons(courseId: string, token: string): Promise<ProgressResponse> {
    try {
      const response = await fetch(`${API_URL}/lesson-progress/completed/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener progreso de lecciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getCompletedLessons:', error);
      throw error;
    }
  }
};