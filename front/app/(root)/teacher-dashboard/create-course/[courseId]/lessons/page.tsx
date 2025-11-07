"use client";
import React, { useState, useRef } from 'react';
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
  HiSparkles,
  HiPlus
} from 'react-icons/hi';
import { FaExclamation } from 'react-icons/fa6';

// Esquema de validación
const validationSchema = Yup.object({
  title: Yup.string()
    .required('El título de la lección es requerido')
    .min(5, 'Mínimo 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  
  videos: Yup.array()
    .min(1, 'Debes subir al menos 1 video por lección')
    .max(3, 'Máximo 3 videos por lección')
    .required('Al menos 1 video es requerido'),
  
  pdfs: Yup.array()
    .min(1, 'Debes subir al menos 1 PDF por lección')
    .max(3, 'Máximo 3 PDFs por lección')
    .required('Al menos 1 PDF es requerido')
});

// Interface para múltiples lecciones
interface LessonFormData extends CreateLessonFormData {
  id: string;
}

const CreateLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState<'videos' | 'pdfs' | null>(null);
  
  // Refs para los inputs de archivo
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para manejar múltiples lecciones
  const [lessons, setLessons] = useState<LessonFormData[]>([
    {
      id: '1',
      title: '',
      videos: [],
      pdfs: []
    }
  ]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const courseId = params?.courseId as string;

  const formik = useFormik<CreateLessonFormData>({
    initialValues: lessons[currentLessonIndex],
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Actualizar la lección actual en el array
      const updatedLessons = [...lessons];
      updatedLessons[currentLessonIndex] = { ...updatedLessons[currentLessonIndex], ...values };
      setLessons(updatedLessons);

      // Si es la última lección o hemos completado todas, crear todas las lecciones
      if (currentLessonIndex === lessons.length - 1) {
        await createAllLessons(updatedLessons);
      } else {
        // Avanzar a la siguiente lección
        setCurrentLessonIndex(currentLessonIndex + 1);
        toastSuccess(`¡Lección ${currentLessonIndex + 1} completada! Continúa con la siguiente.`);
      }
    }
  });

  const createAllLessons = async (allLessons: LessonFormData[]) => {
    if (!courseId || !token) {
      toastError('Error: Datos de curso no válidos');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Crear todas las lecciones una por una
      for (let i = 0; i < allLessons.length; i++) {
        const lesson = allLessons[i];
        if (lesson.title.trim()) { // Solo crear lecciones con título
          await createLessonService(courseId, lesson, token);
        }
      }
      
      toastSuccess('¡Curso creado exitosamente con todas las lecciones!');
      
      // Redirigir al dashboard del profesor
      router.push('/teacher-dashboard');
    } catch (error) {
      console.error('Error creating lessons:', error);
      toastError(error instanceof Error ? error.message : 'Error al crear las lecciones');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewLesson = () => {
    if (lessons.length < 6) {
      // Actualizar la lección actual antes de agregar una nueva
      const updatedLessons = [...lessons];
      updatedLessons[currentLessonIndex] = { ...updatedLessons[currentLessonIndex], ...formik.values };
      
      // Agregar nueva lección
      const newLesson: LessonFormData = {
        id: (lessons.length + 1).toString(),
        title: '',
        videos: [],
        pdfs: []
      };
      
      const newLessons = [...updatedLessons, newLesson];
      setLessons(newLessons);
      setCurrentLessonIndex(newLessons.length - 1);
      
      toastSuccess(`Lección ${currentLessonIndex + 1} guardada. Agregando Lección ${newLessons.length}...`);
    }
  };

  const handleCancel = () => {
    if (formik.dirty || currentLessonIndex > 0) {
      const hasUnsavedChanges = formik.values.title.trim() || formik.values.videos.length > 0 || formik.values.pdfs.length > 0;
      if (hasUnsavedChanges) {
        if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios no guardados.')) {
          router.push('/teacher-dashboard');
        }
      } else {
        router.push('/teacher-dashboard');
      }
    } else {
      router.push('/teacher-dashboard');
    }
  };

  const handleFiles = (files: File[], type: 'videos' | 'pdfs') => {
    const currentFiles = formik.values[type];
    const allowedTypes = type === 'videos' 
      ? ['video/mp4', 'video/mov', 'video/avi', 'video/webm']
      : ['application/pdf'];
    
    const maxFiles = 3; // Máximo 3 archivos para ambos tipos
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toastError(`Archivo ${file.name}: Tipo no permitido`);
        return false;
      }
      return true;
    });

    const newFiles = [...currentFiles, ...validFiles].slice(0, maxFiles);
    
    if (newFiles.length !== currentFiles.length + validFiles.length) {
      toastError(`Solo se permiten ${maxFiles} archivos como máximo por lección`);
    }

    formik.setFieldValue(type, newFiles);
  };

  // Función específica para manejar el cambio del input de archivo
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'videos' | 'pdfs') => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 0) {
      handleFiles(files, type);
      // Resetear el valor del input para permitir seleccionar nuevos archivos
      e.target.value = '';
    }
  };

  // Manejar drag and drop
  const handleDrag = (e: React.DragEvent, type: 'videos' | 'pdfs') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'videos' | 'pdfs') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, type);
  };

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
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent-medium/20 rounded-xl">
              <HiPlay className="w-8 h-8 text-accent-light" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-100">
                Lección {currentLessonIndex + 1} de {lessons.length}
              </h1>
              <p className="text-slate-400">
                Sube videos y materiales de apoyo para tu lección
              </p>
            </div>
          </div>
          
          {/* Indicador de progreso */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-slate-300">
                Progreso del curso
              </span>
              <span className="text-sm text-slate-500">
                {currentLessonIndex + 1}/{lessons.length} lecciones
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent-medium to-accent-light h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Resumen de lecciones completadas */}
        {currentLessonIndex > 0 && (
          <div className="bg-background2/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <HiCheckCircle className="w-5 h-5 text-green-400" />
              Lecciones completadas ({currentLessonIndex})
            </h3>
            <div className="space-y-3">
              {lessons.slice(0, currentLessonIndex).map((lesson, index) => (
                <div key={lesson.id} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <HiCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">
                      Lección {index + 1}: {lesson.title}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {lesson.videos.length} video(s) • {lesson.pdfs.length} PDF(s)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-background2/40 border border-slate-700/50 rounded-2xl p-8">
          {/* Nota de requerimientos */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaExclamation className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-300 font-medium mb-1">Requerimientos por lección</p>
                <p className="text-amber-200 mb-2">
                  Cada lección debe incluir <span className="font-semibold">mínimo 1 video y 1 PDF</span>, 
                  con un máximo de <span className="font-semibold">3 videos y 3 PDFs</span> por lección.
                </p>
                <p className="text-amber-200 text-xs">
                  💡 <span className="font-medium">Tip profesional:</span> Usa nombres descriptivos en tus archivos para una mejor experiencia de aprendizaje.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Título de la lección */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                Título de la Lección *
              </label>
              <input
                id="title"
                type="text"
                placeholder={`Ej: Lección ${currentLessonIndex + 1}: Introducción a los conceptos básicos`}
                {...formik.getFieldProps('title')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium transition-all duration-200 ${
                  formik.touched.title && formik.errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.title}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Upload de Videos */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Videos de la Lección *
              </label>
              <p className="text-slate-500 text-sm mb-4">
                Formatos permitidos: MP4, MOV, AVI, WEBM • <span className="text-red-400 font-medium">Mínimo 1 video</span> • Máximo 3 videos
              </p>
              
              {/* Advertencia sobre nombres de archivos */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-white font-bold">💡</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-blue-300 font-medium mb-1">Consejo importante:</p>
                    <p className="text-blue-200">
                      Asigna nombres descriptivos a tus videos como <span className="font-mono bg-blue-500/20 px-1 rounded">&quot;introduccion_al_tema.mp4&quot;</span> o <span className="font-mono bg-blue-500/20 px-1 rounded">&quot;ejercicios_practicos.mp4&quot;</span>. 
                      Estos nombres aparecerán en las lecciones para que los estudiantes sepan qué contiene cada video.
                    </p>
                  </div>
                </div>
              </div>
              
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                  ${dragActive === 'videos' 
                    ? 'border-accent-medium bg-accent-medium/10' 
                    : formik.touched.videos && formik.errors.videos
                    ? 'border-amber-500 hover:border-amber-400'
                    : 'border-slate-600 hover:border-slate-500'
                  }
                `}
                onDragEnter={(e) => handleDrag(e, 'videos')}
                onDragLeave={(e) => handleDrag(e, 'videos')}
                onDragOver={(e) => handleDrag(e, 'videos')}
                onDrop={(e) => handleDrop(e, 'videos')}
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleInputChange(e, 'videos')}
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
                      Sube los videos explicativos de tu lección con nombres descriptivos
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
              
              {/* Error de validación para videos */}
              {formik.touched.videos && formik.errors.videos && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{String(formik.errors.videos)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Upload de PDFs */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Material de Apoyo - PDFs *
              </label>
              <p className="text-slate-500 text-sm mb-4">
                Sube documentos, presentaciones o recursos adicionales • <span className="text-red-400 font-medium">Mínimo 1 PDF</span> • Máximo 3 PDFs
              </p>
              
              {/* Advertencia sobre nombres de archivos */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-white font-bold">📄</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-green-300 font-medium mb-1">Nombres descriptivos:</p>
                    <p className="text-green-200">
                      Usa nombres claros como <span className="font-mono bg-green-500/20 px-1 rounded">&quot;manual_usuario.pdf&quot;</span>, <span className="font-mono bg-green-500/20 px-1 rounded">&quot;ejercicios_practica.pdf&quot;</span> o <span className="font-mono bg-green-500/20 px-1 rounded">&quot;referencias_teoria.pdf&quot;</span>. 
                      Los estudiantes verán estos nombres al acceder a los documentos.
                    </p>
                  </div>
                </div>
              </div>
              
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                  ${dragActive === 'pdfs' 
                    ? 'border-accent-medium bg-accent-medium/10' 
                    : formik.touched.pdfs && formik.errors.pdfs
                    ? 'border-amber-500 hover:border-amber-400'
                    : 'border-slate-600 hover:border-slate-500'
                  }
                `}
                onDragEnter={(e) => handleDrag(e, 'pdfs')}
                onDragLeave={(e) => handleDrag(e, 'pdfs')}
                onDragOver={(e) => handleDrag(e, 'pdfs')}
                onDrop={(e) => handleDrop(e, 'pdfs')}
              >
                <input
                  ref={pdfInputRef}
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) => handleInputChange(e, 'pdfs')}
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
                      Material de apoyo, ejercicios, presentaciones (nombres descriptivos)
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
              
              {/* Error de validación para PDFs */}
              {formik.touched.pdfs && formik.errors.pdfs && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{String(formik.errors.pdfs)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Nota informativa */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HiCheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  {currentLessonIndex === lessons.length - 1 && lessons.length === 6 ? (
                    <>
                      <p className="text-blue-300 font-medium mb-1">¡Última lección!</p>
                      <p className="text-blue-200">
                        Has alcanzado el máximo de 6 lecciones. Una vez que completes esta lección, 
                        tu curso estará listo y será publicado automáticamente.
                      </p>
                    </>
                  ) : currentLessonIndex === lessons.length - 1 ? (
                    <>
                      <p className="text-blue-300 font-medium mb-1">¡Excelente progreso!</p>
                      <p className="text-blue-200">
                        Recuerda: Cada lección debe tener al menos 1 video y 1 PDF. Puedes finalizar tu curso aquí o agregar hasta {6 - lessons.length} lecciones más.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-300 font-medium mb-1">Lección {currentLessonIndex + 1} de {lessons.length}</p>
                      <p className="text-blue-200">
                        Recuerda incluir al menos 1 video y 1 PDF en cada lección. Completa esta lección para continuar.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-slate-400 hover:text-slate-200 font-medium transition-colors"
              >
                Cancelar
              </button>
              
              <div className="flex items-center gap-3">
                {/* Botón Agregar otra lección - Solo mostrar si no es la última lección y no hemos llegado al máximo */}
                {currentLessonIndex === lessons.length - 1 && lessons.length < 6 && (
                  <button
                    type="button"
                    onClick={addNewLesson}
                    disabled={!formik.isValid || !formik.values.title.trim() || formik.values.videos.length === 0 || formik.values.pdfs.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 font-medium rounded-lg hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiPlus className="w-4 h-4" />
                    Agregar otra lección
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-medium to-accent-light text-white font-medium rounded-lg hover:from-accent-light hover:to-accent-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {currentLessonIndex === lessons.length - 1 ? 'Creando curso...' : 'Guardando lección...'}
                    </>
                  ) : currentLessonIndex === lessons.length - 1 ? (
                    <>
                      <HiSparkles className="w-4 h-4" />
                      Finalizar y Publicar Curso
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="w-4 h-4" />
                      Continuar con Lección {currentLessonIndex + 2}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLessonPage;