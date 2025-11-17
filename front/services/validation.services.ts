const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"
import { TeacherValidationStatus } from "@/types/professionalValidation.types";
import { ProfessorProfileResponse } from "@/types/professor.types";
import { User } from "@/types/user.types";

/**
 * Obtiene el estado de aprobación del profesor desde el nuevo endpoint
 */
export const getProfessorApprovalStatusService = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/profiles/status/my-approval`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Si es 403 (Forbidden), el usuario no es profesor, retornar null sin error ni log
      if (response.status === 403) {
        return null;
      }
      
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener el estado de aprobación"
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    // Si es error de red y el fetch falló con 403, retornar null silenciosamente
    if (error instanceof TypeError) {
      // Error de red, retornar null
      return null;
    }
    // Solo loguear errores que NO sean 403
    if (!(error instanceof Error && error.message.includes('403'))) {
      console.error("Error al obtener estado de aprobación:", error);
    }
    return null; // Retornar null en lugar de lanzar error para evitar romper el flujo
  }
};

/**
 * Obtiene el perfil completo del usuario incluyendo professorProfile
 */
export const getUserWithProfileService = async (
  userId: string,
  token: string
): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener el perfil del usuario"
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al obtener perfil del usuario:", error);
    throw error;
  }
};

/**
 * Obtiene el estado de validación del profesor
 */
export const getTeacherValidationStatus = async (
  userId: string,
  token: string
): Promise<TeacherValidationStatus> => {
  try {
    const user = await getUserWithProfileService(userId, token);

    // Si no es profesor
    if (user.role !== "teacher") {
      return {
        isValidated: false,
        status: "not-submitted",
        hasCompletedProfile: false,
        canCreateCourses: false,
        message: "Debes tener rol de profesor para crear cursos",
      };
    }

    // Si no ha completado el perfil o professorProfile es false
    if (!user.professorProfile || typeof user.professorProfile !== "object") {
      return {
        isValidated: false,
        status: "not-submitted",
        hasCompletedProfile: false,
        canCreateCourses: false,
        message:
          "Debes completar tu perfil profesional para poder crear cursos",
      };
    }

    // Si tiene professorProfile, por ahora siempre está aprobado
    return {
      isValidated: true,
      status: "approved",
      hasCompletedProfile: true,
      canCreateCourses: true,
      message: "¡Tu perfil está completo! Ya puedes crear cursos",
    };
  } catch (error) {
    console.error("Error al obtener estado de validación:", error);
    throw error;
  }
};

/**
 * Envía el formulario de validación profesional
 */
export const submitProfessionalValidation = async (
  formData: FormData,
  token: string
): Promise<{ access_token: string; userReturn: User }> => {
  try {
    const response = await fetch(`${API_URL}/profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // No incluir Content-Type para FormData - el browser lo configura automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al enviar el perfil profesional");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al enviar validación profesional:", error);
    throw error;
  }
};

/**
 * Actualiza el perfil profesional existente
 */
export const updateProfessionalValidation = async (
  formData: FormData,
  token: string
): Promise<{ access_token: string; userReturn: User }> => {
  try {
    const response = await fetch(`${API_URL}/profiles`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // No incluir Content-Type para FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al actualizar el perfil profesional"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar validación profesional:", error);
    throw error;
  }
};

/**
 * Verifica si un profesor puede crear cursos
 */
export const canTeacherCreateCourses = async (
  userId: string,
  token: string
): Promise<boolean> => {
  try {
    const validationStatus = await getTeacherValidationStatus(userId, token);
    return validationStatus.canCreateCourses;
  } catch (error) {
    console.error("Error al verificar permisos de creación:", error);
    return false;
  }
};

/**
 * Obtiene el perfil de profesor específico (si existe)
 */
export const getProfessorProfileService = async (
  userId: string,
  token: string
): Promise<ProfessorProfileResponse | null> => {
  try {
    const user = await getUserWithProfileService(userId, token);
    return user.professorProfile && typeof user.professorProfile === "object"
      ? user.professorProfile
      : null;
  } catch (error) {
    console.error("Error al obtener perfil de profesor:", error);
    throw error;
  }
};
