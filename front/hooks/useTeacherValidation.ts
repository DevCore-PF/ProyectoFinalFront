"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import {
  getTeacherValidationStatus,
  submitProfessionalValidation,
  updateProfessionalValidation,
  getUserWithProfileService,
} from "@/services/validation.services";
import { TeacherValidationStatus } from "@/types/validation.types";

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

      console.log("🔍 LoadValidationStatus - Usuario actual:", user);

      // Si el usuario ya tiene professorProfile, crear el estado directamente
      if (user.role === "teacher" && user.professorProfile) {
        console.log("✅ Usuario tiene professorProfile - perfil completo");
        const newValidationStatus = {
          isValidated: true, // Por ahora siempre aprobado una vez que tiene profile
          status: "approved" as const,
          hasCompletedProfile: true,
          canCreateCourses: true, // Siempre puede crear cursos si tiene profile
          message: "¡Tu perfil está completo! Ya puedes crear cursos",
        };
        setValidationStatus(newValidationStatus);
        return; // Salir temprano ya que tenemos toda la información
      }

      // Si es teacher pero no tiene professorProfile, verificar desde el backend
      if (user.role === "teacher") {
        console.log("🔍 Teacher sin professorProfile, verificando en backend");

        try {
          // Intentar obtener el usuario completo desde el backend
          const fullUser = await getUserWithProfileService(
            JSON.stringify(user.id)
          );
          console.log("🔄 Usuario completo del backend:", fullUser);

          // Si encontramos professorProfile en el backend, actualizar el contexto
          if (fullUser.professorProfile) {
            console.log(
              "🔄 Actualizando usuario con professorProfile del backend"
            );
            const updatedUser = {
              ...user,
              professorProfile: fullUser.professorProfile,
              hasCompletedProfile: fullUser.hasCompletedProfile,
            };
            setUser(updatedUser);

            // Crear estado de validación con los datos del backend
            const newValidationStatus = {
              isValidated: true, // Por ahora siempre aprobado una vez que tiene profile
              status: "approved" as const,
              hasCompletedProfile: true,
              canCreateCourses: true, // Siempre puede crear cursos si tiene profile
              message: "¡Tu perfil está completo! Ya puedes crear cursos",
            };
            setValidationStatus(newValidationStatus);
            return;
          }

          // Si no hay professorProfile, usar el servicio de validación
          const status = await getTeacherValidationStatus(
            JSON.stringify(user.id),
            token
          );
          setValidationStatus(status);
        } catch {
          console.log(
            "🔍 Error obteniendo usuario del backend, usando servicio de validación"
          );
          // Fallback al servicio de validación
          const status = await getTeacherValidationStatus(
            JSON.stringify(user.id),
            token
          );
          setValidationStatus(status);
        }
      } else {
        // No es teacher, no necesita validación
        setValidationStatus(null);
      }
    } catch (err) {
      console.error("Error loading validation status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar estado de validación"
      );
    } finally {
      setIsLoading(false);
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
      const isUpdate =
        validationStatus?.hasCompletedProfile &&
        validationStatus.status === "rejected";

      let response;
      if (isUpdate) {
        response = await updateProfessionalValidation(formData, token);
      } else {
        response = await submitProfessionalValidation(formData, token);
      }

      // Actualizar token y usuario con la respuesta del backend
      if (response.access_token) {
        setToken(response.access_token);
      }
      setUser(response.userReturn);

      console.log(
        "✅ Usuario actualizado después de envío:",
        response.userReturn
      );
      console.log(
        "✅ Profesor Profile creado:",
        response.userReturn.professorProfile
      );

      // Crear estado de validación directamente desde la respuesta actualizada
      const updatedUser = response.userReturn;

      if (updatedUser.role === "teacher" && updatedUser.professorProfile) {
        const newValidationStatus = {
          isValidated: true, // Por ahora siempre aprobado una vez que tiene profile
          status: "approved" as const,
          hasCompletedProfile: true,
          canCreateCourses: true, // Siempre puede crear cursos si tiene profile
          message: "¡Tu perfil está completo! Ya puedes crear cursos",
        };

        console.log("✅ Perfil completado exitosamente - estado actualizado");
        setValidationStatus(newValidationStatus);
      } else {
        console.log("❌ Error: Respuesta no incluye professorProfile");

        // Si no tiene professor profile, necesita validación
        if (updatedUser.role === "teacher") {
          setValidationStatus({
            isValidated: false,
            status: "not-submitted",
            hasCompletedProfile: false,
            canCreateCourses: false,
            message:
              "Necesitas completar tu perfil profesional para poder crear cursos",
          });
        }
      }
    } catch (err) {
      console.error("Error submitting validation:", err);
      setError(
        err instanceof Error ? err.message : "Error al enviar validación"
      );
      throw err; // Re-throw para que el componente pueda manejarlo
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cargar estado inicial
  useEffect(() => {
    loadValidationStatus();
  }, [user?.id, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recargar cuando el usuario cambie (especialmente professorProfile) CAMBIO MIO
  useEffect(() => {
    console.log("🔍 Usuario cambió - verificando si necesita recargar:", {
      hasCompletedProfile: user?.hasCompletedProfile,
      hasProfessorProfile: !!user?.professorProfile,
      currentValidationStatus: validationStatus?.status,
      userRole: user?.role,
    });

    // Si es teacher y no hay estado de validación todavía, cargar
    if (user?.role === "teacher" && !validationStatus && !isLoading) {
      console.log("🔍 Teacher sin estado de validación, cargando...");
      loadValidationStatus();
      return;
    }

    // Si es teacher y acaba de completar el perfil
    if (
      user?.role === "teacher" &&
      user?.professorProfile &&
      validationStatus?.status === "not-submitted"
    ) {
      console.log(
        "🔍 Teacher completó perfil pero estado aún es not-submitted, recargando..."
      );
      loadValidationStatus();
    }
    
  }, [user?.professorProfile?.id, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  // Funciones de utilidad
  const canCreateCourses = validationStatus?.canCreateCourses ?? false;
  const needsValidation = validationStatus?.status === "not-submitted";
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
