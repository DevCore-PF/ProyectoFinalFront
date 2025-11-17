"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaExclamation } from "react-icons/fa6";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
import { useAuth } from "@/context/UserContext";
import { updateCheckboxService } from "@/services/user.service";

const ModalTerms = () => {
  const { user, setUser, token } = useAuth();

  if (!user || user.checkBoxTerms || !user.isEmailVerified) {
    return null;
  }

  const formik = useFormik({
    initialValues: {
      checkBoxTerms: false,
    },
    validationSchema: Yup.object({
      checkBoxTerms: Yup.boolean()
        .oneOf(
          [true],
          "Debes aceptar los términos y condiciones para continuar"
        )
        .required("Debes aceptar los términos y condiciones para continuar"),
    }),
    onSubmit: async (values) => {
      if (!token) return toastError("No hay token");
      try {
        const updatedUser = await updateCheckboxService(token, user.id);

        setUser(updatedUser);
        toastSuccess("Bienvenid@ a DevCore!");
      } catch (error) {
        if (error instanceof Error) {
          toastError(error.message);
        } else {
          toastError("Error al aceptar los términos. Intenta nuevamente.");
        }
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
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
                    formik.values.checkBoxTerms ? "opacity-100" : "opacity-0"
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
                  href="/privacy"
                  target="_blank"
                  className="text-accent-medium hover:underline"
                >
                  Políticas de Privacidad
                </Link>
              </span>
            </label>

            {formik.errors.checkBoxTerms && formik.touched.checkBoxTerms && (
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
            className="w-full bg-button/90 disabled:hover:bg-button/20 disabled:cursor-not-allowed cursor-pointer hover:bg-button transition rounded-md py-3 font-semibold text-font-light disabled:opacity-50"
          >
            {formik.isSubmitting ? "Procesando..." : "Aceptar y continuar"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          No podrás acceder a la plataforma sin aceptar los términos
        </p>
      </div>
    </div>
  );
};

export default ModalTerms;
