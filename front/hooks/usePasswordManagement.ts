import { useState } from "react";
import { setPasswordService, requestPasswordChangeService, canSetPasswordService } from "@/services/password.service";
import { useAuth } from "@/context/UserContext";

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface PasswordChangeData {
  newPassword: string;
  confirmNewPassword: string;
}

export const usePasswordManagement = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isInitializing, setIsInitializing] = useState(true);

  // Estado para determinar capacidades del usuario - inicializado como null para evitar renders prematuros
  const [passwordCapabilities, setPasswordCapabilities] = useState<{
    canSetPassword: boolean;
    hasPassword: boolean;
    isSocialUser: boolean;
  } | null>(null);

  // Verifica las capacidades de contraseña del usuario
  const checkPasswordCapabilities = async () => {
    if (!token) return;

    try {
      setIsInitializing(true);
      const capabilities = await canSetPasswordService(token);
      setPasswordCapabilities(capabilities);
    } catch (error) {
      console.error("Error checking password capabilities:", error);
      // En caso de error, establecer valores por defecto
      setPasswordCapabilities({
        canSetPassword: false,
        hasPassword: false,
        isSocialUser: false,
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Establece una contraseña inicial para usuarios sociales
  const setPassword = async (data: PasswordFormData): Promise<boolean> => {
    if (!token) {
      setMessage({ type: "error", text: "No hay sesión activa" });
      return false;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await setPasswordService(data, token);
      setMessage({
        type: "success",
        text: "Contraseña establecida exitosamente. Ahora puedes iniciar sesión con email y contraseña."
      });
      
      // Actualizar capacidades inmediatamente - el usuario ahora tiene contraseña
      setPasswordCapabilities({
        canSetPassword: false,
        hasPassword: true,
        isSocialUser: passwordCapabilities?.isSocialUser || false,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al establecer la contraseña";
      setMessage({ type: "error", text: errorMessage });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Solicita cambio de contraseña (envía email)
  const requestPasswordChange = async (data: PasswordChangeData): Promise<boolean> => {
    if (!token) {
      setMessage({ type: "error", text: "No hay sesión activa" });
      return false;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await requestPasswordChangeService(data, token);
      setMessage({
        type: "success",
        text: "Solicitud enviada exitosamente. Revisa tu correo electrónico para confirmar el cambio de contraseña."
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al solicitar cambio de contraseña";
      setMessage({ type: "error", text: errorMessage });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar mensajes
  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  return {
    // Estados
    isLoading,
    message,
    passwordCapabilities,
    isInitializing,
    
    // Funciones
    setPassword,
    requestPasswordChange,
    checkPasswordCapabilities,
    clearMessage,
  };
};