const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordServiceResponse {
  success: boolean;
  message: string;
}

/**
 * Establece una contraseña inicial para usuarios de redes sociales
 */
export const setPasswordService = async (
  data: SetPasswordRequest,
  token: string
): Promise<PasswordServiceResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/set-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al establecer la contraseña');
    }

    // Actualizar estado del usuario en sessionStorage antes de retornar
    const updated = updateUserPasswordStatus();
    
    return {
      success: true,
      message: result.message || 'Contraseña establecida exitosamente',
    };
  } catch (error) {
    console.error('Error in setPasswordService:', error);
    throw error;
  }
};

/**
 * Solicita un cambio de contraseña (envía email de confirmación)
 */
export const requestPasswordChangeService = async (
  data: ChangePasswordRequest,
  token: string
): Promise<PasswordServiceResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/request-password-change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al solicitar cambio de contraseña');
    }

    return {
      success: true,
      message: result.message || 'Solicitud enviada. Revisa tu correo para confirmar.',
    };
  } catch (error) {
    console.error('Error in requestPasswordChangeService:', error);
    throw error;
  }
};

/**
 * Actualiza el estado del usuario en sessionStorage después de establecer contraseña
 */
const updateUserPasswordStatus = () => {
  try {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      // Marcar que el usuario ahora tiene contraseña
      user.hasPassword = true;
      user.password = true; // Agregar esta propiedad también
      // Si es usuario social, mantener esas propiedades pero agregar capacidad de contraseña
      sessionStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user password status:', error);
    return false;
  }
};

/**
 * Verifica si el usuario puede establecer una contraseña consultando directamente al backend
 */
export const canSetPasswordService = async (token: string): Promise<{
  canSetPassword: boolean;
  hasPassword: boolean;
  isSocialUser: boolean;
}> => {
  try {
    // Obtener el ID del usuario desde sessionStorage
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      throw new Error('No hay datos de usuario disponibles');
    }
    
    const user = JSON.parse(userData);
    const userId = user.id;
    
    if (!userId) {
      throw new Error('ID de usuario no disponible');
    }

    // Consultar directamente al backend para obtener información confiable
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const backendUser = await response.json();
    
    const isSocialUser = !!(backendUser.isGoogleAccount || backendUser.isGitHubAccount);
    
    // Verificar si el backend devuelve hasPassword, si no, usar una heurística
    let hasPassword;
    if (backendUser.hasPassword !== undefined) {
      // El backend devuelve hasPassword explícitamente
      hasPassword = !!backendUser.hasPassword;
    } else {
      // Fallback: si es usuario social y no aparece password como null, probablemente tiene contraseña
      hasPassword = isSocialUser ? false : true;
    }
    
    const canSetPassword = isSocialUser && !hasPassword;

    // Actualizar sessionStorage con la información correcta
    const updatedUser = {
      ...user,
      hasPassword: hasPassword,
    };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));

    return {
      canSetPassword,
      hasPassword,
      isSocialUser,
    };
    
  } catch (error) {
    console.error('Error checking password capability:', error);
    return {
      canSetPassword: false,
      hasPassword: false,
      isSocialUser: false,
    };
  }
};