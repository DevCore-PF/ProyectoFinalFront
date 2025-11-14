const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Solicita el envío de un email para restablecer contraseña
 */
export const forgotPasswordService = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al solicitar restablecimiento de contraseña');
    }

    return {
      success: true,
      message: result.message || 'Se ha enviado un enlace de restablecimiento a tu correo electrónico',
    };
  } catch (error) {
    console.error('Error in forgotPasswordService:', error);
    throw error;
  }
};

/**
 * Restablece la contraseña usando el token del email
 */
export const resetPasswordService = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al restablecer la contraseña');
    }

    return {
      success: true,
      message: result.message || 'Contraseña restablecida exitosamente',
    };
  } catch (error) {
    console.error('Error in resetPasswordService:', error);
    throw error;
  }
};