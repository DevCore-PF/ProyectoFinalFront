"use client";
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  HiUpload, 
  HiX, 
  HiPlus,
  HiTrash,
  HiCheckCircle 
} from 'react-icons/hi';
import { ProfessionalFormData, ValidationFormProps } from '@/types/validation.types';

// Esquema de validación
const validationSchema = Yup.object({
  profession: Yup.string()
    .required('La profesión es requerida')
    .min(3, 'Mínimo 3 caracteres'),
  
  speciality: Yup.string()
    .required('La especialidad es requerida')
    .min(3, 'Mínimo 3 caracteres'),
  
  biography: Yup.string()
    .max(500, 'Máximo 500 caracteres'),
  
  phone: Yup.string()
    .matches(/^[\d\s\-\+\(\)]*$/, 'Formato de teléfono inválido'),
  
  certificates: Yup.array()
    .min(1, 'Debes subir al menos un certificado')
    .required('Los certificados son requeridos'),
  
  professionalLinks: Yup.array().of(
    Yup.string().url('Debe ser una URL válida')
  ),
  
  agreedToTerms: Yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones'),
  
  agreedToInfo: Yup.boolean()
    .oneOf([true], 'Debes confirmar que la información es verídica'),
  
  agreedToAproveed: Yup.boolean()
    .oneOf([true], 'Debes aceptar el proceso de revisión'),
});

const ProfessionalValidationForm: React.FC<ValidationFormProps> = ({ 
  onSubmit, 
  isSubmitting = false, 
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const formik = useFormik<ProfessionalFormData>({
    initialValues: {
      phone: '',
      profession: '',
      speciality: '',
      biography: '',
      certificates: [],
      professionalLinks: [''],
      agreedToTerms: false,
      agreedToInfo: false,
      agreedToAproveed: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      
      // Agregar campos básicos
      formData.append('phone', values.phone);
      formData.append('profession', values.profession);
      formData.append('speciality', values.speciality);
      formData.append('biography', values.biography);
      formData.append('agreedToTerms', values.agreedToTerms.toString());
      formData.append('agreedToInfo', values.agreedToInfo.toString());
      formData.append('agreedToAproveed', values.agreedToAproveed.toString());
      
      // Agregar certificados
      values.certificates.forEach((file) => {
        formData.append('certificates', file);
      });
      
      // Agregar links profesionales (filtrar vacíos)
      const validLinks = values.professionalLinks.filter(link => link.trim() !== '');
      if (validLinks.length > 0) {
        formData.append('professionalLinks', JSON.stringify(validLinks));
      }
      
      await onSubmit(formData);
    },
  });

  // Handlers para archivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    formik.setFieldValue('certificates', [...formik.values.certificates, ...files]);
  };

  const removeFile = (index: number) => {
    const newFiles = formik.values.certificates.filter((_, i) => i !== index);
    formik.setFieldValue('certificates', newFiles);
  };

  // Handlers para drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    formik.setFieldValue('certificates', [...formik.values.certificates, ...files]);
  };

  // Handlers para links profesionales
  const addProfessionalLink = () => {
    formik.setFieldValue('professionalLinks', [...formik.values.professionalLinks, '']);
  };

  const removeProfessionalLink = (index: number) => {
    const newLinks = formik.values.professionalLinks.filter((_, i) => i !== index);
    formik.setFieldValue('professionalLinks', newLinks);
  };

  const updateProfessionalLink = (index: number, value: string) => {
    const newLinks = [...formik.values.professionalLinks];
    newLinks[index] = value;
    formik.setFieldValue('professionalLinks', newLinks);
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">
          Perfil Profesional
        </h2>
        <p className="text-slate-400 text-sm">
          Completa tu información profesional para poder crear y publicar cursos
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-slate-300 mb-2">
              Profesión o título principal *
            </label>
            <input
              type="text"
              id="profession"
              placeholder='Ej: "Desarrollador Full Stack", "Diseñador UX"'
              {...formik.getFieldProps('profession')}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium/50 transition-all ${
                formik.touched.profession && formik.errors.profession
                  ? 'border-red-500'
                  : 'border-slate-600'
              }`}
            />
            {formik.touched.profession && formik.errors.profession && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.profession}</p>
            )}
          </div>

          <div>
            <label htmlFor="speciality" className="block text-sm font-medium text-slate-300 mb-2">
              Especialidad *
            </label>
            <input
              type="text"
              id="speciality"
              placeholder='Ej: "React", "Backend", "Machine Learning"'
              {...formik.getFieldProps('speciality')}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium/50 transition-all ${
                formik.touched.speciality && formik.errors.speciality
                  ? 'border-red-500'
                  : 'border-slate-600'
              }`}
            />
            {formik.touched.speciality && formik.errors.speciality && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.speciality}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+54 11 1234-5678"
              {...formik.getFieldProps('phone')}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium/50 transition-all ${
                formik.touched.phone && formik.errors.phone
                  ? 'border-red-500'
                  : 'border-slate-600'
              }`}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="biography" className="block text-sm font-medium text-slate-300 mb-2">
              Biografía (opcional)
            </label>
            <textarea
              id="biography"
              rows={4}
              placeholder="Cuéntanos sobre tu experiencia y trayectoria profesional..."
              {...formik.getFieldProps('biography')}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium/50 transition-all resize-none ${
                formik.touched.biography && formik.errors.biography
                  ? 'border-red-500'
                  : 'border-slate-600'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {formik.touched.biography && formik.errors.biography && (
                <p className="text-red-400 text-sm">{formik.errors.biography}</p>
              )}
              <p className="text-slate-500 text-xs ml-auto">
                {formik.values.biography.length}/500
              </p>
            </div>
          </div>
        </div>

        {/* Certificados */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Certificados y títulos *
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-all ${
              dragActive
                ? 'border-accent-medium bg-accent-medium/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <HiUpload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <div className="space-y-2">
                <p className="text-slate-300">
                  Arrastra tus certificados aquí o{' '}
                  <label className="text-accent-medium hover:text-accent-light cursor-pointer">
                    selecciona archivos
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-slate-500 text-xs">
                  PDF, JPG, PNG hasta 1MB por archivo
                </p>
              </div>
            </div>
          </div>

          {/* Lista de archivos seleccionados */}
          {formik.values.certificates.length > 0 && (
            <div className="mt-4 space-y-2">
              {formik.values.certificates.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <HiCheckCircle className="text-green-500 w-5 h-5" />
                    <span className="text-slate-300 text-sm">{file.name}</span>
                    <span className="text-slate-500 text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formik.touched.certificates && formik.errors.certificates && (
            <p className="text-red-400 text-sm mt-2">
              {typeof formik.errors.certificates === 'string' 
                ? formik.errors.certificates 
                : 'Error en los certificados'
              }
            </p>
          )}
        </div>

        {/* Links Profesionales */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-slate-300">
              Enlaces profesionales (opcional)
            </label>
            <button
              type="button"
              onClick={addProfessionalLink}
              className="flex items-center gap-2 px-3 py-1 bg-accent-medium/20 text-accent-medium rounded-lg hover:bg-accent-medium/30 transition-colors text-sm"
            >
              <HiPlus className="w-4 h-4" />
              Agregar enlace
            </button>
          </div>

          <div className="space-y-3">
            {formik.values.professionalLinks.map((link, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateProfessionalLink(index, e.target.value)}
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-medium/50 transition-all"
                />
                {formik.values.professionalLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProfessionalLink(index)}
                    className="px-3 py-3 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Checkboxes de acuerdo */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToTerms"
              {...formik.getFieldProps('agreedToTerms')}
              className="mt-1 w-4 h-4 text-accent-medium bg-slate-800 border-slate-600 rounded focus:ring-accent-medium/50"
            />
            <label htmlFor="agreedToTerms" className="text-sm text-slate-300">
              Acepto los términos y condiciones de la plataforma *
            </label>
          </div>
          {formik.touched.agreedToTerms && formik.errors.agreedToTerms && (
            <p className="text-red-400 text-sm">{formik.errors.agreedToTerms}</p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToInfo"
              {...formik.getFieldProps('agreedToInfo')}
              className="mt-1 w-4 h-4 text-accent-medium bg-slate-800 border-slate-600 rounded focus:ring-accent-medium/50"
            />
            <label htmlFor="agreedToInfo" className="text-sm text-slate-300">
              Confirmo que toda la información proporcionada es verídica *
            </label>
          </div>
          {formik.touched.agreedToInfo && formik.errors.agreedToInfo && (
            <p className="text-red-400 text-sm">{formik.errors.agreedToInfo}</p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToAproveed"
              {...formik.getFieldProps('agreedToAproveed')}
              className="mt-1 w-4 h-4 text-accent-medium bg-slate-800 border-slate-600 rounded focus:ring-accent-medium/50"
            />
            <label htmlFor="agreedToAproveed" className="text-sm text-slate-300">
              Acepto que mi perfil sea revisado y aprobado antes de poder publicar cursos *
            </label>
          </div>
          {formik.touched.agreedToAproveed && formik.errors.agreedToAproveed && (
            <p className="text-red-400 text-sm">{formik.errors.agreedToAproveed}</p>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !formik.isValid}
            className="px-8 py-3 bg-accent-medium hover:bg-accent-light disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-medium/50"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar para Revisión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalValidationForm;