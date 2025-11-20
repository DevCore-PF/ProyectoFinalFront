"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaExclamation,
  FaUserShield,
} from "react-icons/fa";
import { HiMail, HiUser } from "react-icons/hi";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import { registerAdminForm } from "@/types/admin.types";
import { registerAdminValidation } from "@/validators/registerSchema";
import { registerAdminSerivice } from "@/services/admin.service";
import { useAuth } from "@/context/UserContext";

interface InviteAdminFormProps {
  onClose?: () => void;
}

const AdminForm = ({ onClose }: InviteAdminFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useAuth();

  const formik = useFormik<registerAdminForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerAdminValidation,
    validateOnMount: false,
    onSubmit: async (values) => {
      try {
        if (token) {
          const data = await registerAdminSerivice(token, values);
        }
        toastSuccess("Invitación enviada exitosamente!");
        formik.resetForm();
      } catch (error) {
        if (error instanceof Error) {
          toastError(error.message);
        } else {
          toastError("Error al enviar la invitación");
        }
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2.5 sm:p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shrink-0">
          <FaUserShield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-font-light">
            Invitar Nuevo Administrador
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Completa los datos para enviar una invitación
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
          >
            Nombre completo
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              placeholder="Ingresa el nombre completo"
              {...formik.getFieldProps("name")}
              className={`w-full h-11 sm:h-12 rounded-lg bg-background border px-4 pl-10 sm:pl-11 text-sm sm:text-base text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                formik.touched.name && formik.errors.name
                  ? "border-amber-400/50 focus:ring-amber-400/50"
                  : "border-slate-700 focus:ring-border-light/80"
              }`}
            />
            <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          </div>
          {formik.errors.name && formik.touched.name && (
            <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
              <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <FaExclamation className="shrink-0" size={14} />
                <span>{formik.errors.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="admin@devcore.com"
              {...formik.getFieldProps("email")}
              className={`w-full h-11 sm:h-12 rounded-lg bg-background border px-4 pl-10 sm:pl-11 text-sm sm:text-base text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                formik.touched.email && formik.errors.email
                  ? "border-amber-400/50 focus:ring-amber-400/50"
                  : "border-slate-700 focus:ring-border-light/80"
              }`}
            />
            <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          </div>
          {formik.errors.email && formik.touched.email && (
            <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
              <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <FaExclamation className="shrink-0" size={14} />
                <span>{formik.errors.email}</span>
              </p>
            </div>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Mínimo 8 caracteres"
              {...formik.getFieldProps("password")}
              className={`w-full h-11 sm:h-12 rounded-lg bg-background border px-4 pr-10 sm:pr-11 text-sm sm:text-base text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                formik.touched.password && formik.errors.password
                  ? "border-amber-400/50 focus:ring-amber-400/50"
                  : "border-slate-700 focus:ring-border-light/80"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? (
                <FaRegEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FaRegEye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          {formik.errors.password && formik.touched.password && (
            <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
              <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <FaExclamation className="shrink-0" size={14} />
                <span>{formik.errors.password}</span>
              </p>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-2">
            La contraseña debe contener mayúsculas, minúsculas y números
          </p>
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Repite la contraseña"
              {...formik.getFieldProps("confirmPassword")}
              className={`w-full h-11 sm:h-12 rounded-lg bg-background border px-4 pr-10 sm:pr-11 text-sm sm:text-base text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-amber-400/50 focus:ring-amber-400/50"
                  : "border-slate-700 focus:ring-border-light/80"
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showConfirmPassword ? (
                <FaRegEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FaRegEye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
              <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <FaExclamation className="shrink-0" size={14} />
                <span>{formik.errors.confirmPassword}</span>
              </p>
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="pt-2">
          <button
            type="submit"
            onClick={() => {
              formik.setTouched({
                name: true,
                email: true,
                password: true,
                confirmPassword: true,
              });
            }}
            disabled={formik.isSubmitting}
            className="w-full bg-button/90 hover:bg-button cursor-pointer transition-all rounded-lg py-2.5 sm:py-3 font-semibold text-sm sm:text-base text-font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Enviando invitación...</span>
                <span className="sm:hidden">Enviando...</span>
              </>
            ) : (
              <>
                <FaUserShield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Crear Administrador</span>
                <span className="sm:hidden">Crear Admin</span>
              </>
            )}
          </button>
        </div>

        {/* Info adicional */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
          <p className="text-blue-300 text-xs sm:text-sm">
            <strong>Nota:</strong> Se enviará un email a{" "}
            <span className="break-all">{formik.values.email || "el usuario"}</span> con las credenciales de
            acceso.
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
