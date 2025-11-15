"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiUpload, HiX, HiPlus, HiTrash, HiCheckCircle } from "react-icons/hi";
import { IoCloseCircleOutline, IoFolderOutline } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa6";
import Link from "next/link";
import {
  ProfessionalFormData,
  ValidationFormProps,
} from "@/types/professionalValidation.types";

// Esquema de validación
const validationSchema = Yup.object({
  profession: Yup.string()
    .required("La profesión es requerida")
    .min(3, "Mínimo 3 caracteres"),

  speciality: Yup.string()
    .required("La especialidad es requerida")
    .min(3, "Mínimo 3 caracteres"),

  biography: Yup.string().max(500, "Máximo 500 caracteres"),

  phone: Yup.string().matches(
    /^[\d\s\-\+\(\)]*$/,
    "Formato de teléfono inválido"
  ),

  certificates: Yup.array()
    .min(1, "Debes subir al menos un certificado")
    .required("Los certificados son requeridos"),

  professionalLinks: Yup.array().of(
    Yup.string().test(
      "is-url-or-empty",
      "Debe ser una URL válida",
      (value) => !value || value.trim() === "" || /^https?:\/\/.+/.test(value)
    )
  ),

  agreedToTerms: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los términos y condiciones"
  ),

  agreedToInfo: Yup.boolean().oneOf(
    [true],
    "Debes confirmar que la información es verídica"
  ),

  agreedToAproveed: Yup.boolean().oneOf(
    [true],
    "Debes aceptar el proceso de revisión"
  ),
});

const ProfessionalValidationForm: React.FC<ValidationFormProps> = ({
  onSubmit,
  isSubmitting = false,
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);

  const formik = useFormik<ProfessionalFormData>({
    initialValues: {
      phone: "",
      profession: "",
      speciality: "",
      biography: "",
      certificates: [],
      professionalLinks: [""],
      agreedToTerms: false,
      agreedToInfo: false,
      agreedToAproveed: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      // Agregar campos básicos
      formData.append("phone", values.phone);
      formData.append("profession", values.profession);
      formData.append("speciality", values.speciality);
      formData.append("biography", values.biography);
      formData.append("agreedToTerms", values.agreedToTerms.toString());
      formData.append("agreedToInfo", values.agreedToInfo.toString());
      formData.append("agreedToAproveed", values.agreedToAproveed.toString());

      // Agregar certificados
      values.certificates.forEach((file) => {
        file && formData.append("certificates", file);
      });

      // Agregar links profesionales (filtrar vacíos y agregar https:// si falta)
      const validLinks = values.professionalLinks
        .filter((link) => link.trim() !== "")
        .map((link) => {
          const trimmedLink = link.trim();
          // Si no tiene protocolo, agregar https://
          if (!/^https?:\/\//i.test(trimmedLink)) {
            return `https://${trimmedLink}`;
          }
          return trimmedLink;
        });
      if (validLinks.length > 0) {
        formData.append("professionalLinks", JSON.stringify(validLinks));
      }

      await onSubmit(formData);
    },
  });

  // Handlers para archivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    formik.setFieldValue("certificates", [
      ...formik.values.certificates,
      ...files,
    ]);
  };

  const removeFile = (index: number) => {
    const newFiles = formik.values.certificates.filter((_, i) => i !== index);
    formik.setFieldValue("certificates", newFiles);
  };

  // Handlers para drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    formik.setFieldValue("certificates", [
      ...formik.values.certificates,
      ...files,
    ]);
  };

  // Handlers para links profesionales
  const addProfessionalLink = () => {
    formik.setFieldValue("professionalLinks", [
      ...formik.values.professionalLinks,
      "",
    ]);
  };

  const removeProfessionalLink = (index: number) => {
    const newLinks = formik.values.professionalLinks.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("professionalLinks", newLinks);
  };

  const updateProfessionalLink = (index: number, value: string) => {
    const newLinks = [...formik.values.professionalLinks];
    newLinks[index] = value;
    formik.setFieldValue("professionalLinks", newLinks);
  };

  return (
    <div
      className={`border border-border p-8 rounded-2xl shadow-lg ${className}`}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-2">
        Perfil Profesional
      </h1>
      <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">
        Completa tu información profesional para poder crear y publicar cursos
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <h2 className="text-lg font-medium mb-4">Información académica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="profession" className="block text-sm mb-1">
                  Profesión o título principal *
                </label>
                <input
                  type="text"
                  id="profession"
                  placeholder='Ej: "Ingeniera en Sistemas", "Diseñador UX"'
                  {...formik.getFieldProps("profession")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.profession && formik.errors.profession
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.profession && formik.touched.profession && (
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-1">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.profession}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="speciality" className="block text-sm mb-1">
                  Área de especialización *
                </label>
                <input
                  type="text"
                  id="speciality"
                  placeholder='Ej: "Frontend", "Data Science"'
                  {...formik.getFieldProps("speciality")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.speciality && formik.errors.speciality
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.speciality && formik.touched.speciality && (
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-1">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.speciality}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Certificados */}
              <div>
                <label htmlFor="certificates" className="block text-sm">
                  Certificados o títulos *
                </label>
                <div className="mt-2">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                      dragActive
                        ? "border-accent-medium bg-accent-medium/10"
                        : "border-accent-medium/70"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="certificates-file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="certificates-file"
                      className="flex items-center justify-center w-full cursor-pointer"
                    >
                      <span className="text-font-light/55 text-sm">
                        Sube tu certificado...
                      </span>
                      <span className="bg-background px-2 py-1 ml-3 rounded-md transition-all duration-200 hover:scale-105">
                        <IoFolderOutline
                          className="text-accent-medium"
                          size={25}
                        />
                      </span>
                    </label>
                  </div>

                  {/* Lista de archivos */}
                  {formik.values.certificates.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formik.values.certificates.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-center justify-between w-full h-12 rounded-md bg-background2 px-3 text-sm border-2 border-dashed border-accent-medium/70">
                            <span className="text-font-light/55">
                              {file?.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-accent-medium/70 hover:text-accent-medium cursor-pointer"
                            >
                              <IoCloseCircleOutline size={28} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formik.values.certificates.length < 4 && (
                    <button
                      type="button"
                      className="text-accent-medium w-full text-sm hover:underline flex items-end justify-end mt-2 cursor-pointer"
                      onClick={() =>
                        document.getElementById("certificates-file")?.click()
                      }
                    >
                      + Agregar certificado
                    </button>
                  )}

                  {formik.touched.certificates &&
                    formik.errors.certificates && (
                      <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                        <p className="text-amber-300 text-sm flex items-center gap-1">
                          <FaExclamation className="shrink-0" size={16} />
                          <span>
                            {typeof formik.errors.certificates === "string"
                              ? formik.errors.certificates
                              : "Error en los certificados"}
                          </span>
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Datos Personales */}
          <div>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="phone" className="block text-sm mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Ingresa tu teléfono"
                  {...formik.getFieldProps("phone")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.phone && formik.errors.phone
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.phone && formik.touched.phone && (
                  <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-sm flex items-center gap-1">
                      <FaExclamation className="shrink-0" size={16} />
                      <span>{formik.errors.phone}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="links" className="block text-sm mb-1">
                  Links profesionales
                </label>
                {formik.values.professionalLinks.map((link, i) => {
                  const touchedLinks = formik.touched.professionalLinks as
                    | boolean[]
                    | undefined;
                  const errorLinks = formik.errors.professionalLinks as
                    | string[]
                    | undefined;

                  return (
                    <div key={i} className="mt-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={link}
                          id={`link-${i}`}
                          onChange={(e) =>
                            updateProfessionalLink(i, e.target.value)
                          }
                          placeholder="Link a portfolio, LinkedIn o sitio personal"
                          onBlur={() =>
                            formik.setFieldTouched(
                              `professionalLinks[${i}]`,
                              true
                            )
                          }
                          className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                            touchedLinks?.[i] && errorLinks?.[i]
                              ? "border border-amber-400/50"
                              : ""
                          }`}
                        />
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => removeProfessionalLink(i)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-medium/70 hover:text-accent-medium cursor-pointer text-sm hover:underline"
                          >
                            <IoCloseCircleOutline size={28} />
                          </button>
                        )}
                      </div>
                      {touchedLinks?.[i] && errorLinks?.[i] && (
                        <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                          <p className="text-amber-300 text-sm flex items-center gap-1">
                            <FaExclamation className="shrink-0" size={16} />
                            <span>{errorLinks[i]}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
                {formik.values.professionalLinks.length < 5 && (
                  <button
                    type="button"
                    onClick={addProfessionalLink}
                    className="text-accent-medium text-sm hover:underline self-end cursor-pointer mt-2"
                  >
                    + Agregar link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Biografía */}
        <div className="mt-6">
          <label htmlFor="biography" className="block text-sm mb-1">
            Breve biografía
          </label>
          <textarea
            maxLength={500}
            id="biography"
            {...formik.getFieldProps("biography")}
            placeholder="Contanos tu experiencia y enfoque de enseñanza..."
            className={`w-full h-28 rounded-md bg-background2 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
              formik.touched.biography && formik.errors.biography
                ? "border border-amber-400/50"
                : ""
            }`}
          />
          {formik.errors.biography && formik.touched.biography && (
            <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
              <p className="text-amber-300 text-sm flex items-center gap-1">
                <FaExclamation className="shrink-0" size={16} />
                <span>{formik.errors.biography}</span>
              </p>
            </div>
          )}
          <p
            className={`text-sm flex justify-end mr-2 ${
              formik.values.biography.length === 500
                ? "text-orange-400"
                : formik.values.biography.length >= 450
                ? "text-yellow-200"
                : "text-font-light/50"
            }`}
          >
            {formik.values.biography.length}/500
          </p>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start sm:items-center gap-1 text-xs text-gray-300">
            <label
              htmlFor="agreedToInfo"
              className="inline-flex items-start sm:items-center cursor-pointer w-full sm:w-auto"
            >
              <input
                id="agreedToInfo"
                name="agreedToInfo"
                type="checkbox"
                checked={formik.values.agreedToInfo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-[5px] shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                  formik.values.agreedToInfo
                    ? "bg-accent-dark border-accent-dark"
                    : "border-border"
                }`}
              >
                <svg
                  className={`w-3 h-3 text-font-light transition-opacity ${
                    formik.values.agreedToInfo ? "opacity-100" : "opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="ml-2 select-none text-sm leading-snug sm:leading-normal">
                Declaro que la información proporcionada es verídica
              </span>
            </label>
            {formik.errors.agreedToInfo && formik.touched.agreedToInfo && (
              <p className="text-amber-300 text-sm flex items-center gap-1">
                <FaExclamation className="shrink-0" size={16} />
                <span>{formik.errors.agreedToInfo}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-start sm:items-center gap-1 text-xs text-gray-300">
            <label
              htmlFor="agreedToTerms"
              className="inline-flex items-start sm:items-center cursor-pointer w-full sm:w-auto"
            >
              <input
                id="agreedToTerms"
                name="agreedToTerms"
                type="checkbox"
                checked={formik.values.agreedToTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-[5px] shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                  formik.values.agreedToTerms
                    ? "bg-accent-dark border-accent-dark"
                    : "border-border"
                }`}
              >
                <svg
                  className={`w-3 h-3 text-font-light transition-opacity ${
                    formik.values.agreedToTerms ? "opacity-100" : "opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="ml-2 select-none text-sm leading-snug sm:leading-normal">
                Acepto los{" "}
                <Link
                  href="/terms"
                  className="text-accent-medium hover:underline"
                >
                  Términos y Condiciones para instructores
                </Link>
              </span>
            </label>
            {formik.errors.agreedToTerms && formik.touched.agreedToTerms && (
              <p className="text-amber-300 text-sm flex items-center gap-1">
                <FaExclamation className="shrink-0" size={16} />
                <span>{formik.errors.agreedToTerms}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-start sm:items-center gap-1 text-xs text-gray-300">
            <label
              htmlFor="agreedToAproveed"
              className="inline-flex items-start sm:items-center cursor-pointer w-full sm:w-auto"
            >
              <input
                id="agreedToAproveed"
                name="agreedToAproveed"
                type="checkbox"
                checked={formik.values.agreedToAproveed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border rounded-[5px] shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                  formik.values.agreedToAproveed
                    ? "bg-accent-dark border-accent-dark"
                    : "border-border"
                }`}
              >
                <svg
                  className={`w-3 h-3 text-font-light transition-opacity ${
                    formik.values.agreedToAproveed ? "opacity-100" : "opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="ml-2 select-none text-sm leading-snug sm:leading-normal">
                Entiendo que mi solicitud está sujeta a aprobación del equipo de
                DevCore
              </span>
            </label>
            {formik.errors.agreedToAproveed &&
              formik.touched.agreedToAproveed && (
                <p className="text-amber-300 text-sm flex items-center gap-1">
                  <FaExclamation className="shrink-0" size={16} />
                  <span>{formik.errors.agreedToAproveed}</span>
                </p>
              )}
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer bg-button/90 hover:bg-button transition rounded-md py-2 mt-6 font-semibold w-full sm:w-auto px-6 mx-auto block disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar para Revisión"}
        </button>
      </form>
    </div>
  );
};

export default ProfessionalValidationForm;

