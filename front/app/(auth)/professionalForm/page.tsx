"use client";
//Formik
import { useFormik } from "formik";
//Next / React
import Link from "next/link";
import { useState } from "react";
//Helpers
import { toastSuccess } from "@/helpers/toast";
import {
  professionalForm,
  professionalFormType,
  professionalFormValidation,
} from "@/validators/registerSchema";
//Icons
import { IoCloseCircleOutline } from "react-icons/io5";

const RegisterProfesor = () => {
  const [certificates, setCertificates] = useState<(File | null)[]>([null]);
  const [links, setLinks] = useState([""]);

  const formik = useFormik<professionalFormType>({
    initialValues: professionalForm,
    validationSchema: professionalFormValidation,
    onSubmit: (values) => {
      console.log(values);
      toastSuccess("Registro enviado!");
    },
  });

  const addCertificate = () => {
    setCertificates([...certificates, null]);
  };

  const closeCertificate = (id: number) => {
    if (certificates.length === 1) return;
    setCertificates(certificates.filter((_, index) => index !== id));
  };
  const addLink = () => {
    setLinks([...links, ""]);
  };

  const closeLink = (id: number) => {
    if (links.length === 1) return;
    setLinks(links.filter((_, index) => index !== id));
  };
  return (
    <div className="min-h-screen flex flex-col text-font-light bg-background">
      <header className="p-4">
        <Link href="/">
          <span className="font-semibold">LOGO</span>
        </Link>
      </header>

      <section className="flex flex-1 justify-center items-center px-4 py-8">
        <form
          onSubmit={formik.handleSubmit}
          className="border border-border p-8 rounded-2xl shadow-lg w-full max-w-6xl"
        >
          <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-2">
            Registro de profesor
          </h1>
          <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">
            Completá el formulario con tus datos personales y profesionales y
            sumate como profesor a DevCore.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DATOS PERSONALES */}
            <div>
              <h2 className="text-lg font-medium mb-3">Datos personales</h2>

              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor="fullName" className="block text-sm mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="fullName"
                    id="fullName"
                    placeholder="Ingresá tu nombre completo"
                    {...formik.getFieldProps("fullName")}
                    className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.fullName && formik.touched.fullName ? (
                    <p className="text-red-400 text-sm text-center mt-2">
                      {formik.errors.fullName}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Ingresá tu email"
                    {...formik.getFieldProps("email")}
                    className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.email && formik.errors.email
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <p className="text-red-400 text-sm text-center mt-2">
                      {formik.errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="Ingresá tu teléfono"
                    {...formik.getFieldProps("phone")}
                    className="w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 "
                  />
                </div>

                <div>
                  <label htmlFor="picture" className="block text-sm mb-1">
                    Foto de perfil *
                  </label>
                  <input
                    id="picture"
                    type="file"
                    {...formik.getFieldProps("picture")}
                    className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.picture && formik.errors.picture
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.picture && formik.touched.picture ? (
                    <p className="text-red-400 text-sm text-center mt-2">
                      {formik.errors.picture}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* INFORMACIÓN ACADÉMICA */}
            <div>
              <h2 className="text-lg font-medium mb-3">
                Información académica
              </h2>

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
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.profession && formik.touched.profession ? (
                    <p className="text-red-400 text-sm text-center mt-2">
                      {formik.errors.profession}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm mb-1">
                    Área de especialización *
                  </label>
                  <input
                    type="text"
                    id="area"
                    placeholder='Ej: "Frontend", "Data Science"'
                    {...formik.getFieldProps("area")}
                    className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.area && formik.errors.area
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.area && formik.touched.area ? (
                    <p className="text-red-400 text-sm text-center mt-2">
                      {formik.errors.area}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="links" className="block text-sm mb-1">
                    Certificados o títulos *
                  </label>
                  {certificates.map((certificate, i) => (
                    <div key={i} className="relative mt-2">
                      <input
                        type="file"
                        onChange={(e) => {
                          const files = [...formik.values.certificates];
                          files[i] = e.target.files?.[0] || null; 
                          formik.setFieldValue("certificates", files);
                        }}
                        onBlur={() =>
                          formik.setFieldTouched("certificates", true)
                        }
                        className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                          formik.touched.certificates &&
                          formik.errors.certificates
                            ? "border border-red-500"
                            : ""
                        }`}
                      />
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => closeCertificate(i)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-medium cursor-pointer text-sm hover:underline"
                        >
                          <IoCloseCircleOutline size={28} />
                        </button>
                      )}
                    </div>
                  ))}
                  {formik.touched.certificates &&
                    formik.errors.certificates && (
                      <p className="text-red-400 text-sm text-center mt-2">
                        {Array.isArray(formik.errors.certificates)
                          ? formik.errors.certificates
                              .map((err) =>
                                typeof err === "string"
                                  ? err
                                  : "Archivo inválido"
                              )
                              .join(", ")
                          : formik.errors.certificates}
                      </p>
                    )}
                </div>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="text-accent-medium text-sm hover:underline self-end cursor-pointer"
                >
                  + Agregar certificado
                </button>
                <div>
                  <label htmlFor="links" className="block text-sm mb-1">
                    Links profesionales
                  </label>
                  {links.map((link, i) => (
                    <div key={i} className="relative mt-2">
                      <input
                        type="text"
                        value={link}
                        id="links"
                        onChange={(e) => {
                          const newLinks = [...links];
                          newLinks[i] = e.target.value;
                          setLinks(newLinks);
                        }}
                        placeholder="Link a portfolio, LinkedIn o sitio personal"
                        className="w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50"
                      />
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => closeLink(i)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-medium cursor-pointer text-sm hover:underline"
                        >
                          <IoCloseCircleOutline size={28} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addLink}
                  className="text-accent-medium text-sm hover:underline self-end cursor-pointer"
                >
                  + Agregar link
                </button>
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="mt-6">
            <label className="block text-sm mb-1">Breve biografía *</label>
            <textarea
              id="bio"
              placeholder="Contanos tu experiencia y enfoque de enseñanza..."
              {...formik.getFieldProps("bio")}
              className="w-full h-28 rounded-md bg-background2 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 resize-none"
            />
          </div>

          {/* CHECKBOXES */}
          <div className="flex flex-col gap-2 mt-4 text-xs sm:text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-accent-medium" />
              Declaro que la información proporcionada es verídica
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-accent-medium" />
              Acepto los Términos y condiciones para instructores
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-accent-medium" />
              Entiendo que mi solicitud está sujeta a aprobación del equipo de
              DevCore
            </label>
          </div>

          <button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="bg-button/90 hover:bg-button transition rounded-md py-2 mt-6 font-semibold w-full sm:w-auto px-6 mx-auto block disabled:cursor-not-allowed disabled:opacity-50"
          >
            Completar registro
          </button>
        </form>
      </section>
    </div>
  );
};

export default RegisterProfesor;
