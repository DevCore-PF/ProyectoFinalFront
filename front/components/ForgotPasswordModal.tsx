"use client";

import React, { useState } from "react";
import { FaEnvelope, FaTimes } from "react-icons/fa";
import { forgotPasswordService } from "@/services/forgot-password.service";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toastError("Por favor ingresa tu email");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toastError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPasswordService({ email });
      setIsSubmitted(true);
      toastSuccess("Se ha enviado un enlace de restablecimiento a tu correo");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al enviar el email";
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background2 border border-border rounded-xl shadow-2xl max-w-md w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-font-light flex items-center gap-2">
            <FaEnvelope className="text-accent-light" />
            ¿Olvidaste tu contraseña?
          </h2>
          <button
            onClick={handleClose}
            className="text-font-light/60 hover:text-font-light transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-font-light/70 text-sm">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-font-light mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-button hover:bg-button/90 text-font-light px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      Enviar enlace
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-3 bg-background2/40 hover:bg-background2/60 text-font-light rounded-lg font-medium transition-all duration-300 border border-border-light/20"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <FaEnvelope className="text-green-400 text-2xl" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-font-light mb-2">
                  Email enviado
                </h3>
                <p className="text-font-light/70 text-sm">
                  Hemos enviado un enlace de restablecimiento a{" "}
                  <span className="font-medium text-accent-light">{email}</span>
                </p>
                <p className="text-font-light/60 text-xs mt-2">
                  Revisa tu bandeja de entrada y spam. El enlace expira en 1 hora.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="bg-button hover:bg-button/90 text-font-light px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Entendido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;