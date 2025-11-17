"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaExclamation } from "react-icons/fa6";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
import { useAuth } from "@/context/UserContext";
import {
  updateCheckboxService,
  updateRoleService,
} from "@/services/user.service";
import { useState, useEffect } from "react";
import TinyLoader from "./Loaders/TinyLoader";
import { HiArrowRight } from "react-icons/hi";
import { GoMortarBoard } from "react-icons/go";
import { HiOutlineComputerDesktop } from "react-icons/hi2";

const ModalOnboarding = () => {
  const { user, setUser, token } = useAuth();
  const [step, setStep] = useState<"terms" | "role">("terms");

  useEffect(() => {
    if (user) {
      if (!user.checkBoxTerms) {
        setStep("terms");
      } else if (user.role === null) {
        setStep("role");
      }
    }
  }, [user]);

  const formik = useFormik<{
    checkBoxTerms: boolean;
    role: "student" | "teacher" | "admin" | null;
  }>({
    initialValues: {
      checkBoxTerms: user?.checkBoxTerms || false,
      role: user?.role || null,
    },
    validationSchema: Yup.object({
      checkBoxTerms:
        step === "terms"
          ? Yup.boolean()
              .oneOf(
                [true],
                "Debes aceptar los términos y condiciones para continuar"
              )
              .required(
                "Debes aceptar los términos y condiciones para continuar"
              )
          : Yup.boolean().notRequired(),
      role:
        step === "role"
          ? Yup.string()
              .oneOf(["student", "teacher"], "Rol inválido")
              .required("Debes seleccionar un rol para continuar")
          : Yup.string().notRequired(),
    }),
    onSubmit: async (values) => {
      if (!token) return toastError("No hay token");

      try {
        if (step === "terms") {
          const updatedUser = await updateCheckboxService(token, user!.id);
          setUser(updatedUser);

          if (updatedUser.role !== null) {
            toastSuccess("Bienvenid@ a DevCore!");
          } else {
            setStep("role");
            formik.setFieldValue("checkBoxTerms", true);
          }
        } else if (step === "role") {
          if (!values.role || values.role === null) {
            toastError("Debes seleccionar un rol");
            return;
          }
          const response = await updateRoleService(values.role, token);

          if (response.userReturn) {
            setUser(response.userReturn);
          } else {
            const updatedUser = {
              ...user!,
              role: values.role,
            };
            setUser(updatedUser);
          }

          toastSuccess("Bienvenid@ a DevCore!");
        }
      } catch (error) {
        if (error instanceof Error) {
          toastError(error.message);
        } else {
          toastError("Error al procesar. Intenta nuevamente.");
        }
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  if (
    !user ||
    !user.isEmailVerified ||
    (user.checkBoxTerms && user.role !== null)
  ) {
    return null;
  }

  const shouldShowTerms = !user.checkBoxTerms;
  const shouldShowRole = user.checkBoxTerms && user.role === null;

  if (!shouldShowTerms && !shouldShowRole) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {shouldShowTerms && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-font-light mb-2">
                Términos y Condiciones
              </h2>
              <p className="text-sm text-gray-400">
                Para continuar, debes aceptar nuestros términos y condiciones
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="bg-background2 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Al aceptar estos términos, confirmas que:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-medium mt-1">•</span>
                    <span>
                      Has leído y comprendes nuestros términos de servicio
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-medium mt-1">•</span>
                    <span>
                      Aceptas las políticas de privacidad de la plataforma
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-medium mt-1">•</span>
                    <span>
                      Te comprometes a usar la plataforma de forma responsable
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-medium mt-1">•</span>
                    <span>Cumplirás con las normas de la comunidad</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="checkBoxTerms"
                  className="inline-flex items-start cursor-pointer w-full"
                >
                  <input
                    id="checkBoxTerms"
                    name="checkBoxTerms"
                    type="checkbox"
                    checked={formik.values.checkBoxTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border rounded-[5px] shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                      formik.values.checkBoxTerms
                        ? "bg-accent-dark border-accent-dark"
                        : "border-border"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 text-font-light transition-opacity ${
                        formik.values.checkBoxTerms
                          ? "opacity-100"
                          : "opacity-0"
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
                  <span className="ml-3 select-none text-sm text-gray-300 leading-snug">
                    Acepto los{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-accent-medium hover:underline"
                    >
                      Términos y Condiciones
                    </Link>{" "}
                    y las{" "}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      className="text-accent-medium hover:underline"
                    >
                      Políticas de Privacidad
                    </Link>
                  </span>
                </label>

                {formik.errors.checkBoxTerms &&
                  formik.touched.checkBoxTerms && (
                    <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-3">
                      <p className="text-amber-300 text-sm flex items-center gap-2">
                        <FaExclamation className="shrink-0" size={16} />
                        <span>{formik.errors.checkBoxTerms}</span>
                      </p>
                    </div>
                  )}
              </div>

              <button
                type="submit"
                onClick={() => {
                  formik.setTouched({
                    checkBoxTerms: true,
                  });
                }}
                disabled={formik.isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-button/90 disabled:bg-button/30 disabled:hover:bg-button/20 disabled:cursor-not-allowed cursor-pointer hover:bg-button transition rounded-md py-3 font-semibold text-font-light disabled:opacity-50"
              >
                {formik.isSubmitting ? (
                  <>
                    Procesando <TinyLoader />
                  </>
                ) : (
                  <>
                    Aceptar y continuar
                    <HiArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              No podrás acceder a la plataforma sin aceptar los términos
            </p>
          </>
        )}

        {shouldShowRole && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-font-light mb-2">
                Selecciona tu rol
              </h2>
              <p className="text-sm text-gray-400">
                Elige cómo quieres usar la plataforma
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {[
                  {
                    value: "teacher",
                    label: "Profesor",
                    description: "Crea cursos y comparte tu conocimiento",
                    icon: <GoMortarBoard />,
                  },
                  {
                    value: "student",
                    label: "Alumn@",
                    description: "Aprende y desarrolla nuevas habilidades",
                    icon: <HiOutlineComputerDesktop />,
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => formik.setFieldValue("role", option.value)}
                    className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
                      formik.values.role === option.value
                        ? "scale-[1.02] shadow-md shadow-accent-medium/30"
                        : "hover:scale-[1.01] shadow-md hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-accent-medium/10 to-transparent transition-opacity duration-300 ${
                        formik.values.role === option.value
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                    />

                    <div
                      className={`relative border-2 rounded-xl p-5 backdrop-blur-sm transition-all duration-300 ${
                        formik.values.role === option.value
                          ? "border-accent-medium bg-background2/80"
                          : "border-border bg-background2/50 group-hover:border-accent-medium/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
                              formik.values.role === option.value
                                ? "opacity-30 bg-accent-medium"
                                : "opacity-0 group-hover:opacity-20 group-hover:bg-accent-medium"
                            }`}
                          />
                          <div
                            className={`relative text-4xl transition-all duration-300 ${
                              formik.values.role === option.value
                                ? "scale-110"
                                : "group-hover:scale-105"
                            }`}
                          >
                            {option.icon}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-font-light mb-1">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {option.description}
                          </p>
                        </div>

                        {formik.values.role === option.value && (
                          <div className="shrink-0">
                            <svg
                              className="w-6 h-6 text-accent-medium"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formik.values.role === option.value}
                      onChange={formik.handleChange}
                      className="sr-only"
                    />
                  </div>
                ))}
              </div>

              {formik.errors.role && formik.touched.role && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mb-4">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.role}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                onClick={() => {
                  formik.setTouched({
                    role: true,
                  });
                }}
                disabled={formik.isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-button/90 disabled:bg-button/30 disabled:hover:bg-button/20 disabled:cursor-not-allowed cursor-pointer hover:bg-button transition rounded-md py-3 font-semibold text-font-light disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {formik.isSubmitting ? (
                    <>
                      Procesando <TinyLoader />
                    </>
                  ) : (
                    <>
                      Aceptar y continuar
                      <HiArrowRight />
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              Podrás cambiar tu rol más adelante en configuración
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalOnboarding;
