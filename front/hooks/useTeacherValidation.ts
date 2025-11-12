"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import {
  submitProfessionalValidation,
  updateProfessionalValidation,
  getUserWithProfileService,
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

      console.log("🔍 LoadValidationStatus - Usuario actual:", {
        id: user.id,
        role: user.role,
        professorProfile: user.professorProfile,
        professorProfileType: typeof user.professorProfile,
        hasCompletedProfile: user.hasCompletedProfile,
      });

      // Si el usuario ya tiene professorProfile, crear el estado directamente
      if (
        user.role === "teacher" &&
        user.professorProfile &&
        typeof user.professorProfile === "object"
      ) {
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

      // Si es teacher pero no tiene professorProfile, SIEMPRE verificar desde el backend
      if (user.role === "teacher") {
        console.log("🔍 Teacher sin professorProfile, verificando en backend");

        try {
          // SIEMPRE obtener el usuario completo desde el backend para asegurar datos frescos
          const fullUser = await getUserWithProfileService(
            user.id.toString(),
            token
          );
          console.log("🔄 Usuario completo del backend:", fullUser);

          // Si encontramos professorProfile en el backend, actualizar el contexto
          // Verificar que sea un objeto y no un booleano false
          if (
            fullUser.professorProfile &&
            typeof fullUser.professorProfile === "object"
          ) {
            console.log(
              "🔄 Actualizando usuario con professorProfile del backend"
            );
            const updatedUser = {
              ...user,
              professorProfile: fullUser.professorProfile,
              hasCompletedProfile: fullUser.hasCompletedProfile ?? true, // Marcar como completado si tiene profile
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

          // IMPORTANTE: Si el backend no tiene professorProfile pero el usuario local sí,
          // NO sobrescribir. Esto evita perder datos por respuestas inconsistentes del backend
          if (
            !fullUser.professorProfile &&
            user.professorProfile &&
            typeof user.professorProfile === "object"
          ) {
            console.log(
              "⚠️ Backend sin professorProfile pero usuario local sí tiene. Manteniendo datos locales."
            );
            const newValidationStatus = {
              isValidated: true,
              status: "approved" as const,
              hasCompletedProfile: true,
              canCreateCourses: true,
              message: "¡Tu perfil está completo! Ya puedes crear cursos",
            };
            setValidationStatus(newValidationStatus);
            return;
          }

          // Si no hay professorProfile en el backend, establecer estado not-submitted
          console.log(
            "❌ No se encontró professorProfile válido en el backend. Valor recibido:",
            fullUser.professorProfile
          );
          setValidationStatus({
            isValidated: false,
            status: "not-submitted",
            hasCompletedProfile: false,
            canCreateCourses: false,
            message:
              "Debes completar tu perfil profesional para poder crear cursos",
          });
        } catch (backendError) {
          console.error(
            "🔍 Error obteniendo usuario del backend:",
            backendError
          );
          // Si hay error de backend, establecer estado de error
          setValidationStatus({
            isValidated: false,
            status: "not-submitted",
            hasCompletedProfile: false,
            canCreateCourses: false,
            message:
              "Error al cargar estado de validación. Intenta refrescar la página.",
          });
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

  // Cargar estado inicial con un pequeño delay para permitir que UserContext se actualice
  useEffect(() => {
    // Solo cargar si no tenemos validationStatus todavía
    if (!validationStatus) {
      // Pequeño delay para permitir que UserContext termine de cargar datos frescos
      const timer = setTimeout(() => {
        loadValidationStatus();
      }, 200); // 200ms de delay

      return () => clearTimeout(timer);
    }
  }, [user?.id, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recargar cuando el usuario cambie (especialmente professorProfile)
  useEffect(() => {
    console.log("🔍 Usuario cambió - verificando si necesita recargar:", {
      hasCompletedProfile: user?.hasCompletedProfile,
      hasProfessorProfile: !!(
        user?.professorProfile && typeof user.professorProfile === "object"
      ),
      professorProfileValue: user?.professorProfile,
      currentValidationStatus: validationStatus?.status,
      userRole: user?.role,
    });

    // Si es teacher y no hay estado de validación todavía, cargar
    if (user?.role === "teacher" && !validationStatus && !isLoading) {
      loadValidationStatus();
      return;
    }

    // Si es teacher y acaba de completar el perfil, recargar
    if (
      user?.role === "teacher" &&
      user?.professorProfile &&
      typeof user.professorProfile === "object" &&
      validationStatus?.status === "not-submitted"
    ) {
   
      loadValidationStatus();
    }
  }, [
    user?.professorProfile && typeof user.professorProfile === "object"
      ? user.professorProfile.id
      : null,
    user?.role,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Efecto específico para detectar cambios en professorProfile
  useEffect(() => {
    if (
      user?.role === "teacher" &&
      user?.professorProfile &&
      typeof user.professorProfile === "object" &&
      validationStatus?.status !== "approved"
    ) {
     
      const newValidationStatus = {
        isValidated: true,
        status: "approved" as const,
        hasCompletedProfile: true,
        canCreateCourses: true,
        message: "¡Tu perfil está completo! Ya puedes crear cursos",
      };
      setValidationStatus(newValidationStatus);
    }
    // Si el usuario NO tiene professorProfile válido Y el estado actual dice que está aprobado, corregir
    else if (
      user?.role === "teacher" &&
      (!user?.professorProfile || typeof user.professorProfile !== "object") &&
      validationStatus?.status === "approved"
    ) {
      console.log(
        "⚠️ Estado inconsistente detectado: no hay professorProfile pero estado dice aprobado"
      );
      setValidationStatus({
        isValidated: false,
        status: "not-submitted",
        hasCompletedProfile: false,
        canCreateCourses: false,
        message:
          "Debes completar tu perfil profesional para poder crear cursos",
      });
    }
  }, [user?.professorProfile, validationStatus?.status]); // eslint-disable-line react-hooks/exhaustive-deps

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
