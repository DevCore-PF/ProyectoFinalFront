"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaLock, FaShieldAlt } from "react-icons/fa";
import {
  usePasswordManagement,
  PasswordFormData,
  PasswordChangeData,
} from "@/hooks/usePasswordManagement";

const PasswordSettings = () => {
  const {
    isLoading,
    message,
    passwordCapabilities,
    isInitializing,
    setPassword,
    requestPasswordChange,
    checkPasswordCapabilities,
    clearMessage,
  } = usePasswordManagement();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  // Formulario para establecer contraseña inicial
  const [setPasswordForm, setSetPasswordForm] = useState<PasswordFormData>({
    password: "",
    confirmPassword: "",
  });

  // Formulario para cambiar contraseña
  const [changePasswordForm, setChangePasswordForm] =
    useState<PasswordChangeData>({
      newPassword: "",
      confirmNewPassword: "",
    });

  // Verificar capacidades al montar el componente
  useEffect(() => {
    checkPasswordCapabilities();
  }, []);

  // Limpiar mensajes cuando se cierra la sección
  useEffect(() => {
    if (!isExpanded) {
      clearMessage();
    }
  }, [isExpanded]);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

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

    return errors;
  };

  const handleSetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (setPasswordForm.password !== setPasswordForm.confirmPassword) {
      clearMessage();
      setTimeout(() => {
        clearMessage();
      }, 100);
      return;
    }

    const passwordErrors = validatePassword(setPasswordForm.password);
    if (passwordErrors.length > 0) {
      return;
    }

    const success = await setPassword(setPasswordForm);
    if (success) {
      setSetPasswordForm({ password: "", confirmPassword: "" });
      setShowPasswords({
        password: false,
        confirmPassword: false,
        newPassword: false,
        confirmNewPassword: false,
      });

      // Re-verificar capacidades después de establecer contraseña
      setTimeout(() => {
        checkPasswordCapabilities();
      }, 500);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword
    ) {
      clearMessage();
      setTimeout(() => {
        clearMessage();
      }, 100);
      return;
    }

    const passwordErrors = validatePassword(changePasswordForm.newPassword);
    if (passwordErrors.length > 0) {
      return;
    }

    const success = await requestPasswordChange(changePasswordForm);
    if (success) {
      setChangePasswordForm({ newPassword: "", confirmNewPassword: "" });
      setShowPasswords({
        password: false,
        confirmPassword: false,
        newPassword: false,
        confirmNewPassword: false,
      });
      // Opcional: cerrar la sección después del éxito
      // setIsExpanded(false);
    }
  };

  const handleSetPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSetPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Determinar el estado de la contraseña y el texto a mostrar
  const getPasswordStatus = () => {
    if (!passwordCapabilities) {
      return {
        icon: <FaLock className="text-gray-400" />,
        title: "Cargando...",
        description: "Verificando estado de contraseña",
        action: "Cargando",
      };
    }

    if (passwordCapabilities.canSetPassword) {
      return {
        icon: <FaLock className="text-amber-400" />,
        title: "Establecer Contraseña",
        description: "Configura una contraseña para tu cuenta social",
        action: "Establecer",
      };
    } else if (passwordCapabilities.hasPassword) {
      return {
        icon: <FaShieldAlt className="text-green-400" />,
        title: "Cambiar Contraseña",
        description: "Actualiza tu contraseña actual",
        action: "Cambiar",
      };
    } else {
      return {
        icon: <FaLock className="text-gray-400" />,
        title: "Gestión de Contraseña",
        description: "Gestiona la seguridad de tu cuenta",
        action: "Gestionar",
      };
    }
  };

  const passwordStatus = getPasswordStatus();

  // Mostrar loading si aún se está inicializando
  if (isInitializing || !passwordCapabilities) {
    return (
      <div className="bg-background2/30 border border-border rounded-xl backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-background2/40 rounded-lg">
              <FaLock className="text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-font-light">
                Cargando configuración...
              </h2>
              <p className="text-sm text-font-light/70">
                Verificando estado de contraseña
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background2/30 border border-border rounded-xl backdrop-blur-sm overflow-hidden">
      {/* Header clickeable */}
      <div
        className="p-6 cursor-pointer hover:bg-background2/20 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-background2/40 rounded-lg">
              {passwordStatus.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-font-light">
                {passwordStatus.title}
              </h2>
              <p className="text-sm text-font-light/70">
                {passwordStatus.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-font-light/60">
              {passwordStatus.action}
            </span>
            <div
              className={`transform transition-transform duration-300 text-font-light/60 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="border-t border-border-light/20 p-6 space-y-6">
          {/* Información de requisitos */}
          <div className="bg-background2/20 p-4 rounded-lg border-l-4 border-accent-light/50">
            <h3 className="text-sm font-semibold text-font-light mb-2">
              Requisitos de Contraseña:
            </h3>
            <ul className="text-xs text-font-light/70 space-y-1">
              <li>• Entre 8 y 15 caracteres</li>
              <li>• Al menos una letra minúscula (a-z)</li>
              <li>• Al menos una letra mayúscula (A-Z)</li>
              <li>• Al menos un número (0-9)</li>
              <li>• Al menos un símbolo especial (!@#$%^&*)</li>
            </ul>
          </div>

          {/* Formulario para establecer contraseña inicial */}
          {passwordCapabilities.canSetPassword && (
            <form onSubmit={handleSetPasswordSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-font-light mb-2"
                  >
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPasswords.password ? "text" : "password"}
                      value={setPasswordForm.password}
                      onChange={handleSetPasswordChange}
                      placeholder="Ingresa tu nueva contraseña"
                      className="w-full px-4 py-3 pr-12 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("password")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-font-light/60 hover:text-font-light transition-colors"
                    >
                      {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {setPasswordForm.password && (
                    <div className="mt-2">
                      {validatePassword(setPasswordForm.password).map(
                        (error, index) => (
                          <p key={index} className="text-xs text-amber-400">
                            • {error}
                          </p>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-font-light mb-2"
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      value={setPasswordForm.confirmPassword}
                      onChange={handleSetPasswordChange}
                      placeholder="Confirma tu nueva contraseña"
                      className="w-full px-4 py-3 pr-12 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-font-light/60 hover:text-font-light transition-colors"
                    >
                      {showPasswords.confirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                  {setPasswordForm.confirmPassword &&
                    setPasswordForm.password !==
                      setPasswordForm.confirmPassword && (
                      <p className="text-xs text-amber-400 mt-1">
                        Las contraseñas no coinciden
                      </p>
                    )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !setPasswordForm.password ||
                  !setPasswordForm.confirmPassword ||
                  setPasswordForm.password !==
                    setPasswordForm.confirmPassword ||
                  validatePassword(setPasswordForm.password).length > 0
                }
                className="w-full bg-button hover:bg-button/90 text-font-light px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                    Estableciendo...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Establecer Contraseña
                  </>
                )}
              </button>
            </form>
          )}

          {/* Formulario para cambiar contraseña */}
          {passwordCapabilities.hasPassword &&
            !passwordCapabilities.canSetPassword && (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-font-light mb-2"
                    >
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.newPassword ? "text" : "password"}
                        value={changePasswordForm.newPassword}
                        onChange={handleChangePasswordChange}
                        placeholder="Ingresa tu nueva contraseña"
                        className="w-full px-4 py-3 pr-12 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-font-light/60 hover:text-font-light transition-colors"
                      >
                        {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {changePasswordForm.newPassword && (
                      <div className="mt-2">
                        {validatePassword(changePasswordForm.newPassword).map(
                          (error, index) => (
                            <p key={index} className="text-xs text-amber-400">
                              • {error}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmNewPassword"
                      className="block text-sm font-medium text-font-light mb-2"
                    >
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        type={
                          showPasswords.confirmNewPassword ? "text" : "password"
                        }
                        value={changePasswordForm.confirmNewPassword}
                        onChange={handleChangePasswordChange}
                        placeholder="Confirma tu nueva contraseña"
                        className="w-full px-4 py-3 pr-12 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmNewPassword")
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-font-light/60 hover:text-font-light transition-colors"
                      >
                        {showPasswords.confirmNewPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                    {changePasswordForm.confirmNewPassword &&
                      changePasswordForm.newPassword !==
                        changePasswordForm.confirmNewPassword && (
                        <p className="text-xs text-amber-400 mt-1">
                          Las contraseñas no coinciden
                        </p>
                      )}
                  </div>
                </div>

                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300">
                    <strong>Importante:</strong> Se enviará un enlace de
                    confirmación a tu correo electrónico. Debes hacer clic en el
                    enlace para completar el cambio de contraseña.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !changePasswordForm.newPassword ||
                    !changePasswordForm.confirmNewPassword ||
                    changePasswordForm.newPassword !==
                      changePasswordForm.confirmNewPassword ||
                    validatePassword(changePasswordForm.newPassword).length > 0
                  }
                  className="w-full bg-button hover:bg-button/90 text-font-light px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                      Solicitando...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt />
                      Solicitar Cambio
                    </>
                  )}
                </button>
              </form>
            )}

          {/* Mensajes de estado */}
          {message.text && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordSettings;
