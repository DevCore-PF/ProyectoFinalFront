import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Servicio para que un estudiante solicite ser profesor
export const requestTeacherRoleService = async (formData: FormData, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/request-upgrade`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // No incluir Content-Type para FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al enviar solicitud para ser profesor");
    }

    const data = await response.json();
    // No mostramos toast aquí, lo maneja el componente
    return data;
  } catch (error) {
    console.error('Error requesting teacher role:', error);
    // No mostramos toast aquí, lo maneja el componente
    throw error;
  }
};

// Servicio para obtener el estado de la solicitud del estudiante
export const getStudentApplicationStatusService = async (token: string): Promise<any> => {
  try {
    // Usamos el endpoint /users/update con un body vacío para obtener la información del usuario actual
    // Este endpoint ya existe, usa JWT auth y retorna el usuario actualizado
    const userResponse = await fetch(`${API_BASE_URL}/users/update`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Body vacío para no cambiar nada, solo obtener datos
    });

    if (!userResponse.ok) {
      throw new Error(`Error ${userResponse.status}: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    
    // Si no está solicitando ser profesor, no tiene aplicación
    if (!userData.isRequestingTeacherRole) {
      return {
        hasApplication: false,
        status: null,
        message: null
      };
    }

    // Si está solicitando ser profesor, verificamos su rol actual
    // Solo los profesores pueden acceder al endpoint de approval status
    if (userData.role === 'teacher') {
      try {
        const profileResponse = await fetch(`${API_BASE_URL}/profiles/status/my-approval`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          return {
            hasApplication: profileData.hasProfile,
            status: profileData.approvalStatus,
            message: profileData.message
          };
        }
      } catch (profileError) {
        console.error('Error accessing teacher profile:', profileError);
      }
    }

    // Si es estudiante con isRequestingTeacherRole = true, significa que tiene solicitud pendiente
    return {
      hasApplication: true,
      status: 'pending',
      message: 'Tu solicitud está siendo revisada por nuestro equipo.'
    };

  } catch (error) {
    console.error('Error fetching student application status:', error);
    return {
      hasApplication: false,
      status: null,
      message: null
    };
  }
};

export default {
  requestTeacherRoleService,
  getStudentApplicationStatusService,
};