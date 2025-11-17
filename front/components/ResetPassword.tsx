"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { resetPasswordService } from "@/services/forgot-password.service";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import Link from "next/link";
<<<<<<< HEAD

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
=======
const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toastError("Token de restablecimiento no válido");
<<<<<<< HEAD
      router.push('/login');
=======
      router.push("/login");
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
    }
  }, [token, router]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
<<<<<<< HEAD
    
=======

>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
    if (password.length < 8) {
      errors.push("Mínimo 8 caracteres");
    }
    if (password.length > 15) {
      errors.push("Máximo 15 caracteres");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Al menos una minúscula");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Al menos una mayúscula");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Al menos un número");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push("Al menos un símbolo (!@#$%^&*)");
    }
<<<<<<< HEAD
    
=======

>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
    return errors;
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
<<<<<<< HEAD
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
=======
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    setFormData(prev => ({
      ...prev,
      [name]: value
=======
    setFormData((prev) => ({
      ...prev,
      [name]: value,
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    
=======

>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
    if (!token) {
      toastError("Token no válido");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toastError("Las contraseñas no coinciden");
      return;
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toastError("La contraseña no cumple los requisitos");
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordService({
        token,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
<<<<<<< HEAD
      
      setIsSuccess(true);
      toastSuccess("Contraseña restablecida exitosamente");
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login?passwordReset=true');
      }, 3000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al restablecer la contraseña";
=======

      setIsSuccess(true);
      toastSuccess("Contraseña restablecida exitosamente");

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login?passwordReset=true");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al restablecer la contraseña";
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-[size:100px_100px] flex items-center justify-center p-4">
        <div className="bg-background2/30 border border-border rounded-xl p-8 backdrop-blur-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-green-400 text-2xl" />
          </div>
<<<<<<< HEAD
          
          <h1 className="text-2xl font-bold text-font-light mb-4">
            ¡Contraseña restablecida!
          </h1>
          
          <p className="text-font-light/70 mb-6">
            Tu contraseña ha sido restablecida exitosamente. Serás redirigido al login en unos segundos.
          </p>
          
=======

          <h1 className="text-2xl font-bold text-font-light mb-4">
            ¡Contraseña restablecida!
          </h1>

          <p className="text-font-light/70 mb-6">
            Tu contraseña ha sido restablecida exitosamente. Serás redirigido al
            login en unos segundos.
          </p>

>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
          <Link
            href="/login"
            className="inline-block bg-button hover:bg-button/90 text-font-light px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-[size:100px_100px] flex items-center justify-center p-4">
      <div className="bg-background2/30 border border-border rounded-xl p-8 backdrop-blur-sm max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-button/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-accent-light text-2xl" />
          </div>
<<<<<<< HEAD
          
          <h1 className="text-2xl font-bold text-font-light mb-2">
            Restablecer contraseña
          </h1>
          
=======

          <h1 className="text-2xl font-bold text-font-light mb-2">
            Restablecer contraseña
          </h1>

>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
          <p className="text-font-light/70 text-sm">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Información de requisitos */}
        <div className="bg-background2/20 p-4 rounded-lg border-l-4 border-accent-light/50 mb-6">
          <h3 className="text-sm font-semibold text-font-light mb-2">
            Requisitos de contraseña:
          </h3>
          <ul className="text-xs text-font-light/70 space-y-1">
            <li>• Entre 8 y 15 caracteres</li>
            <li>• Al menos una letra minúscula (a-z)</li>
            <li>• Al menos una letra mayúscula (A-Z)</li>
            <li>• Al menos un número (0-9)</li>
            <li>• Al menos un símbolo especial (!@#$%^&*)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
<<<<<<< HEAD
            <label htmlFor="newPassword" className="block text-sm font-medium text-font-light mb-2">
=======
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-font-light mb-2"
            >
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPasswords.newPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-4 py-3 pr-12 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                required
              />
              <button
                type="button"
<<<<<<< HEAD
                onClick={() => togglePasswordVisibility('newPassword')}
=======
                onClick={() => togglePasswordVisibility("newPassword")}
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-font-light/60 hover:text-font-light transition-colors"
              >
                {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.newPassword && (
              <div className="mt-2">
                {validatePassword(formData.newPassword).map((error, index) => (
<<<<<<< HEAD
                  <p key={index} className="text-xs text-red-400">• {error}</p>
=======
                  <p key={index} className="text-xs text-amber-400">
                    • {error}
                  </p>
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
                ))}
              </div>
            )}
          </div>

          <div>
<<<<<<< HEAD
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-font-light mb-2">
=======
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-font-light mb-2"
            >
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showPasswords.confirmNewPassword ? "text" : "password"}
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                placeholder="Confirma tu nueva contraseña"
                className="w-full px-4 py-3 pr-12 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                required
              />
              <button
                type="button"
<<<<<<< HEAD
                onClick={() => togglePasswordVisibility('confirmNewPassword')}
=======
                onClick={() => togglePasswordVisibility("confirmNewPassword")}
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-font-light/60 hover:text-font-light transition-colors"
              >
                {showPasswords.confirmNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
<<<<<<< HEAD
            {formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword && (
              <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>
            )}
=======
            {formData.confirmNewPassword &&
              formData.newPassword !== formData.confirmNewPassword && (
                <p className="text-xs text-amber-400 mt-1">
                  Las contraseñas no coinciden
                </p>
              )}
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
          </div>

          <div className="space-y-4 pt-4">
            <button
              type="submit"
              disabled={
<<<<<<< HEAD
                isLoading || 
                !formData.newPassword || 
                !formData.confirmNewPassword || 
=======
                isLoading ||
                !formData.newPassword ||
                !formData.confirmNewPassword ||
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
                formData.newPassword !== formData.confirmNewPassword ||
                validatePassword(formData.newPassword).length > 0
              }
              className="w-full bg-button hover:bg-button/90 text-font-light px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                  Restableciendo...
                </>
              ) : (
                <>
                  <FaLock />
                  Restablecer contraseña
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-accent-light hover:text-accent-medium transition-colors text-sm"
              >
                ← Volver al login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ResetPassword;
=======
export default ResetPassword;
>>>>>>> b7e5b95a29666bac1e3f99667d0b36199ff3156e
