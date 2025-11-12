const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CourseLesson {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string | null;
}

export interface PurchasedCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  difficulty: string;
  progress: number;
  purchaseDate: string;
  priceAtPurchase: number;
  completed: boolean;
  enrollmentId: string;
  totalLessons?: number;
  completedLessons?: number;
  lessons?: CourseLesson[];
}

export const purchasedCoursesService = {
  // Obtener cursos comprados del usuario autenticado
  async getMyPurchasedCourses(token: string): Promise<PurchasedCourse[]> {
    try {
      console.log('🛒 Obteniendo cursos comprados...');
      
      const response = await fetch(`${API_URL}/users/me/purchased-courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Respuesta cursos comprados:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error obteniendo cursos comprados:', errorData);
        
        let errorMessage = 'Error al obtener cursos comprados';
        
        switch (response.status) {
          case 401:
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            break;
          case 404:
            errorMessage = 'Usuario no encontrado.';
            break;
          default:
            errorMessage = errorData.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Cursos comprados obtenidos:', result);
      return result;
    } catch (error) {
      console.error('💥 Error getMyPurchasedCourses:', error);
      throw error;
    }
  },

  // Obtener lecciones completadas de un curso específico
  async getCompletedLessons(token: string, courseId: string): Promise<{ courseId: string, totalCompleted: number, lessons: CourseLesson[] }> {
    try {
      console.log('📚 Obteniendo lecciones completadas para el curso:', courseId);
      
      const response = await fetch(`${API_URL}/lesson-progress/completed/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Respuesta lecciones completadas:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error obteniendo lecciones completadas:', errorData);
        
        // Si no hay lecciones completadas, retornar estructura vacía
        if (response.status === 404 || (errorData.message && errorData.message.includes('No hay lecciones completadas'))) {
          return {
            courseId,
            totalCompleted: 0,
            lessons: []
          };
        }
        
        throw new Error(errorData.message || 'Error al obtener lecciones completadas');
      }

      const result = await response.json();
      console.log('✅ Lecciones completadas obtenidas:', result);
      return result;
    } catch (error) {
      console.error('💥 Error getCompletedLessons:', error);
      throw error;
    }
  },

  // Obtener todas las lecciones de un curso (para calcular total)
  async getCourseLessons(token: string, courseId: string): Promise<CourseLesson[]> {
    try {
      console.log('📝 Obteniendo todas las lecciones del curso:', courseId);
      
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Respuesta curso completo:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error obteniendo curso:', errorData);
        throw new Error(errorData.message || 'Error al obtener información del curso');
      }

      const courseData = await response.json();
      console.log('✅ Información del curso obtenida:', courseData);
      
      // Retornar solo las lecciones formateadas
      return (courseData.lessons || []).map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        completed: false, // Se actualizará con el progreso
        completedAt: null
      }));
    } catch (error) {
      console.error('💥 Error getCourseLessons:', error);
      throw error;
    }
  }
};