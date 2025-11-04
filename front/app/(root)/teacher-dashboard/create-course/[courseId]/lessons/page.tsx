"use client";
import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/UserContext';
import { createLessonService } from '@/services/course.services';
import { toastSuccess, toastError } from '@/helpers/alerts.helper';
import { CreateLessonFormData } from '@/types/course.types';
import { 
  HiArrowLeft, 
  HiX, 
  HiPlay, 
  HiDocument,
  HiCheckCircle,
  HiSparkles
} from 'react-icons/hi';

// Esquema de validación
const validationSchema = Yup.object({
  title: Yup.string()
    .required('El título de la lección es requerido')
    .min(5, 'Mínimo 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  
  videos: Yup.array()
    .max(5, 'Máximo 5 videos por lección'),
  
  pdfs: Yup.array()
    .max(10, 'Máximo 10 PDFs por lección')
});

const CreateLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState<'videos' | 'pdfs' | null>(null);

  const courseId = params?.courseId as string;

  const formik = useFormik<CreateLessonFormData>({
    initialValues: {
      title: '',
      videos: [],
      pdfs: []
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!courseId || !token) {
        toastError('Error: Datos de curso no válidos');
        return;
      }

      try {
        setIsSubmitting(true);
        
        await createLessonService(courseId, values, token);
        
        toastSuccess('¡Lección creada exitosamente!');
        
        // Redirigir al dashboard del profesor
        router.push('/teacher-dashboard');
      } catch (error) {
        console.error('Error creating lesson:', error);
        toastError(error instanceof Error ? error.message : 'Error al crear la lección');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleFiles = useCallback((files: File[], type: 'videos' | 'pdfs') => {
    const currentFiles = formik.values[type];
    const allowedTypes = type === 'videos' 
      ? ['video/mp4', 'video/mov', 'video/avi', 'video/webm']
      : ['application/pdf'];
    
    const maxFiles = type === 'videos' ? 5 : 10;
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toastError(`Archivo ${file.name}: Tipo no permitido`);
        return false;
      }
      return true;
    });

    const newFiles = [...currentFiles, ...validFiles].slice(0, maxFiles);
    
    if (newFiles.length !== currentFiles.length + validFiles.length) {
      toastError(`Solo se permiten ${maxFiles} archivos como máximo`);
    }

    formik.setFieldValue(type, newFiles);
  }, [formik]);

  // Manejar drag and drop
  const handleDrag = useCallback((e: React.DragEvent, type: 'videos' | 'pdfs') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'videos' | 'pdfs') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, type);
  }, [handleFiles]);

  const removeFile = (index: number, type: 'videos' | 'pdfs') => {
    const currentFiles = formik.values[type];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    formik.setFieldValue(type, newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background2 to-background3 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/teacher-dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-accent-medium/20 rounded-xl">
              <HiPlay className="w-8 h-8 text-accent-light" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Agregar Lección al Curso
              </h1>
              <p className="text-slate-400">
                Sube videos y materiales de apoyo para tu lección
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-background2/40 border border-slate-700/50 rounded-2xl p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Título de la lección */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                Título de la Lección *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Ej: Lección 1: Introducción a los componentes"
                {...formik.getFieldProps('title')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                  formik.touched.title && formik.errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.title}</p>
              )}
            </div>

            {/* Upload de Videos */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Videos de la Lección (Opcional)
              </label>
              <p className="text-slate-500 text-sm mb-4">
                Formatos permitidos: MP4, MOV, AVI, WEBM • Máximo 5 videos
              </p>
              
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                  ${dragActive === 'videos' 
                    ? 'border-accent-medium bg-accent-medium/10' 
                    : 'border-slate-600 hover:border-slate-500'
                  }
                `}
                onDragEnter={(e) => handleDrag(e, 'videos')}
                onDragLeave={(e) => handleDrag(e, 'videos')}
                onDragOver={(e) => handleDrag(e, 'videos')}
                onDrop={(e) => handleDrop(e, 'videos')}
              >
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleFiles(Array.from(e.target.files || []), 'videos')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <HiPlay className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium">
                      Arrastra videos aquí o haz clic para seleccionar
                    </p>
                    <p className="text-slate-500 text-sm">
                      Sube los videos explicativos de tu lección
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de videos subidos */}
              {formik.values.videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formik.values.videos.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <HiPlay className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 font-medium truncate">{file.name}</p>
                        <p className="text-slate-500 text-sm">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'videos')}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload de PDFs */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Material de Apoyo - PDFs (Opcional)
              </label>
              <p className="text-slate-500 text-sm mb-4">
                Sube documentos, presentaciones o recursos adicionales • Máximo 10 PDFs
              </p>
              
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                  ${dragActive === 'pdfs' 
                    ? 'border-accent-medium bg-accent-medium/10' 
                    : 'border-slate-600 hover:border-slate-500'
                  }
                `}
                onDragEnter={(e) => handleDrag(e, 'pdfs')}
                onDragLeave={(e) => handleDrag(e, 'pdfs')}
                onDragOver={(e) => handleDrag(e, 'pdfs')}
                onDrop={(e) => handleDrop(e, 'pdfs')}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) => handleFiles(Array.from(e.target.files || []), 'pdfs')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <HiDocument className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium">
                      Arrastra PDFs aquí o haz clic para seleccionar
                    </p>
                    <p className="text-slate-500 text-sm">
                      Material de apoyo, ejercicios, presentaciones
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de PDFs subidos */}
              {formik.values.pdfs.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formik.values.pdfs.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <HiDocument className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 font-medium truncate">{file.name}</p>
                        <p className="text-slate-500 text-sm">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'pdfs')}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nota informativa */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HiCheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium mb-1">¡Último paso!</p>
                  <p className="text-blue-200">
                    Una vez que completes esta lección, tu curso estará listo y será publicado 
                    automáticamente para que los estudiantes puedan inscribirse.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => router.push('/teacher-dashboard')}
                className="px-6 py-3 text-slate-400 hover:text-slate-200 font-medium transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !formik.isValid}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-medium to-accent-light text-white font-medium rounded-lg hover:from-accent-light hover:to-accent-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creando lección...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-4 h-4" />
                    Finalizar y Publicar Curso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLessonPage;