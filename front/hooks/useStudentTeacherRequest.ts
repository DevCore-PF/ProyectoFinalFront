import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/UserContext';
import { getStudentApplicationStatusService, requestTeacherRoleService } from '@/services/student-teacher-request.service';

interface StudentApplicationStatus {
  hasApplication: boolean;
  status: 'pending' | 'approved' | 'rejected' | null;
  message: string | null;
  rejectionReason: string | null;
  canApply: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useStudentTeacherRequest = () => {
  const { user, token, refreshUser } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<StudentApplicationStatus>({
    hasApplication: false,
    status: null,
    message: null,
    rejectionReason: null,
    canApply: true,
    isLoading: true,
    error: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApplicationStatus = useCallback(async () => {
    if (!user?.id || !token || user.role !== 'student') {
      setApplicationStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setApplicationStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const statusData = await getStudentApplicationStatusService(token);
      
      setApplicationStatus({
        hasApplication: statusData.hasApplication,
        status: statusData.status,
        message: statusData.message,
        rejectionReason: statusData.rejectionReason || null,
        canApply: !statusData.hasApplication || statusData.status === 'rejected',
        isLoading: false,
        error: null,
      });

    } catch (error) {
      setApplicationStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, [user?.id, token, user?.role]);

  const submitTeacherRequest = async (formData: FormData): Promise<void> => {
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    try {
      setIsSubmitting(true);
      
      await requestTeacherRoleService(formData, token);
      
      // Recargar el estado de la aplicación
      await fetchApplicationStatus();
      
      // Actualizar los datos del usuario para reflejar isRequestingTeacherRole: true
      await refreshUser();

    } catch (error) {
      console.error('Error submitting teacher request:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cargar estado inicial
  useEffect(() => {
    fetchApplicationStatus();
  }, [fetchApplicationStatus]);

  return {
    applicationStatus,
    isSubmitting,
    submitTeacherRequest,
    refreshStatus: fetchApplicationStatus,
    // Estados derivados para facilitar uso
    isPending: applicationStatus.status === 'pending',
    isApproved: applicationStatus.status === 'approved', 
    isRejected: applicationStatus.status === 'rejected',
    canApply: applicationStatus.canApply && !applicationStatus.isLoading,
    hasApplication: applicationStatus.hasApplication,
  };
};

export default useStudentTeacherRequest;