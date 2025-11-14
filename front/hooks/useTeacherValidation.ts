"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import {
  submitProfessionalValidation,
  updateProfessionalValidation,
  getProfessorApprovalStatusService,
} from "@/services/validation.services";
import { TeacherValidationStatus } from "@/types/professionalValidation.types";

export const useTeacherValidation = () => {
  const { user, token, setUser, setToken } = useAuth();
  const [validationStatus, setValidationStatus] =
    useState<TeacherValidationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar estado de validación
  const loadValidationStatus = async () => {
    if (!user?.id || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Solo verificar si es profesor
      if (user.role !== "teacher") {
        setIsLoading(false);
        return;
      }

      // Usar el nuevo endpoint para obtener el estado de aprobación
      const approvalData = await getProfessorApprovalStatusService(token);
      
      // Convertir la respuesta del backend al formato esperado por el frontend
      const newValidationStatus: TeacherValidationStatus = {
        isValidated: approvalData.approvalStatus === "approved",
        status: approvalData.approvalStatus || "not-submitted", // Si es null, significa que no tiene perfil
        hasCompletedProfile: approvalData.hasProfile,
        canCreateCourses: approvalData.approvalStatus === "approved",
        message: approvalData.message || getStatusMessage(approvalData.approvalStatus, approvalData.hasProfile),
      };

      setValidationStatus(newValidationStatus);

    } catch (error) {
      // Si es un error 400, significa que el usuario no tiene perfil completado
      let fallbackStatus: TeacherValidationStatus;
      
      if (error instanceof Error && error.message.includes("400")) {
        fallbackStatus = {
          isValidated: false,
          status: "not-submitted",
          hasCompletedProfile: false,
          canCreateCourses: false,
          message: "Complete su perfil de profesor para comenzar el proceso de validación.",
        };
        // No establecer error para este caso, es normal para usuarios sin perfil
      } else {
        setError(error instanceof Error ? error.message : "Error desconocido");
        fallbackStatus = {
          isValidated: false,
          status: "not-submitted", 
          hasCompletedProfile: false,
          canCreateCourses: false,
          message: "Error al cargar el estado. Por favor, inténtelo de nuevo.",
        };
      }
      
      setValidationStatus(fallbackStatus);
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para generar mensajes según el estado
  const getStatusMessage = (approvalStatus: string, hasCompletedProfile: boolean): string => {
    if (!hasCompletedProfile) {
      return "Complete su perfil de profesor para comenzar el proceso de validación.";
    }

    switch (approvalStatus) {
      case "pending":
        return "Su solicitud está en revisión. Le notificaremos cuando sea aprobada.";
      case "approved":
        return "¡Su perfil ha sido aprobado! Ya puede crear cursos.";
      case "rejected":
        return "Su solicitud ha sido rechazada. Puede actualizar su perfil y volver a enviar.";
      default:
        return "Complete su perfil de profesor para solicitar aprobación.";
    }
  };

  // Enviar formulario de validación
  const submitValidation = async (formData: FormData): Promise<void> => {
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Determinar si es creación o actualización
      const isUpdate = validationStatus?.hasCompletedProfile && validationStatus.status === "rejected";

      let response;
      if (isUpdate) {
        response = await updateProfessionalValidation(formData, token);
      } else {
        response = await submitProfessionalValidation(formData, token);
      }

      // Solo actualizar token y usuario si es una CREACIÓN de perfil (no actualización)
      // Las actualizaciones (PATCH) solo devuelven el perfil, no token/usuario
      if (!isUpdate) {
        if (response.access_token) {
          setToken(response.access_token);
        }
        
        if (response.userReturn) {
          setUser(response.userReturn);
        }
      }
      
      // Recargar el estado de validación para obtener el estado actualizado desde el backend
      await loadValidationStatus();

    } catch (err) {
      console.error("Error submitting validation:", err);
      setError(err instanceof Error ? err.message : "Error al enviar validación");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efecto para cargar el estado inicial
  useEffect(() => {
    if (user && token) {
      loadValidationStatus();
    }
  }, [user?.id, token]); // Solo cuando cambie el usuario o token

  // Funciones de utilidad
  const canCreateCourses = validationStatus?.canCreateCourses ?? false;
  const needsValidation = !validationStatus?.hasCompletedProfile || validationStatus?.status === "not-submitted";
  const isPending = validationStatus?.status === "pending";
  const isApproved = validationStatus?.status === "approved";
  const isRejected = validationStatus?.status === "rejected";



  return {
    validationStatus,
    isLoading,
    error,
    isSubmitting,
    canCreateCourses,
    needsValidation,
    isPending,
    isApproved,
    isRejected,
    submitValidation,
    refreshStatus: loadValidationStatus,
  };
};
