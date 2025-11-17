const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const courseVisibilityService = {
  /**
   * Cambia la visibilidad del curso entre PUBLICO y PRIVADO
   */
  async toggleVisibility(courseId: string, token: string): Promise<{ visibility: string }> {
    try {
      const response = await fetch(`${API_URL}/courses/change/visibility/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cambiar la visibilidad del curso');
      }

      const result = await response.json();
      
      // El backend retorna el curso completo, pero nosotros solo necesitamos la visibilidad
      // Visibility changed successfully
      return { visibility: result.visibility };
    } catch (error) {
      console.error('Error courseVisibilityService.toggleVisibility:', error);
      throw error;
    }
  },
};