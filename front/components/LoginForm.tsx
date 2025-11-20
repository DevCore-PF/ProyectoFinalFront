"use client";
//Icons
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";

//Types & Validators
import { LoginFormData } from "@/types/auth.types";
import { loginInitialValues, loginValidations } from "@/validators/loginSchema";
//Formik
import { useFormik } from "formik";
//Next/React
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
//Services
import { loginUserService, resendEmailService } from "@/services/user.service";
//Helpers
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
//Context
import { useAuth } from "@/context/UserContext";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import GitHubAuthButton from "@/components/GitHubAuthButton";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import Loader from "./Loaders/Loader";
import TinyLoader from "./Loaders/TinyLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/user.types";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailNotVerified, setShowEmailNotVerified] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  // const [timeRemaining, setTimeRemaining] = useState<number>(180);
  const [timeRemaining, setTimeRemaining] = useState<number>(3600);
  const [canResend, setCanResend] = useState(false);
  const { setToken, setUser, user, isLoading } = useAuth();
  const [loadingResender, setLoadingResender] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userTimestamp");
  }, []);
  const formik = useFormik<LoginFormData>({
    initialValues: loginInitialValues,
    validationSchema: loginValidations,
    validateOnMount: false,
    onSubmit: async () => {
      try {
        const data = await loginUserService(formik.values);
        setToken(data.access_token);
        setUser(data.userReturn);
        toastSuccess("Login exitoso!");
        window.location.href = "/";
      } catch (error) {
        if (error instanceof Error) {
          toastError(error.message);
        } else {
          toastError("Error desconocido");
        }
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendEmail = async (user: User) => {
    try {
      setLoadingResender(true);
      await resendEmailService(user.email);
      toastSuccess("Email de verificación reenviado!");
      setTimeRemaining(180);
      setCanResend(false);
    } catch (error) {
      toastError("Error al reenviar el email");
    } finally {
      setLoadingResender(false);
    }
  };

  useEffect(() => {
    if (user && !user.isEmailVerified && (!user?.isGoogleAccount || !user?.isGoogleAccount)) {
      setShowEmailNotVerified(true);
    }
  }, [user]);

  useEffect(() => {
    const passwordReset = searchParams.get("passwordReset");
    if (passwordReset === "true") {
      toastSuccess("Contraseña restablecida exitosamente. Ya puedes iniciar sesión.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (showEmailNotVerified && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showEmailNotVerified, timeRemaining]);

  useEffect(() => {
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    if (error && error_description) {
      toastError(decodeURIComponent(error_description));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen text-font-light flex flex-col">
      <header className="p-6">
        <div className="flex  gap-2 items-center text-[1.5rem] font-medium  ">
          <Link href={"/"} className="flex items-center space-x-2 cursor-pointer">
            <Image
              alt="logoDev"
              src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761576978/logoDevCorchetes_vh3ui7.webp"
              width={500}
              height={500}
              className="h-9  w-9"
            />
          </Link>
        </div>
      </header>

      <section className="flex flex-1 justify-center items-center px-4">
        <form
          onSubmit={formik.handleSubmit}
          className="border-border border p-4 sm:p-8 rounded-2xl w-full max-w-lg shadow-lg m-10 sm:m-15"
        >
          <h1 className="text-4xl font-bold text-center mb-2">Login</h1>
          {showEmailNotVerified ? (
            <>
              <p className="text-amber-300/80 text-center mb-4">
                {`Debes confirmar tu email para iniciar sesión. Revisa tu bandeja de
              entrada en ${user?.email}.`}
              </p>
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="text-center">
                  {canResend ? (
                    <p className="text-green-300/70 text-sm ">Ya puedes reenviar el código</p>
                  ) : (
                    <p className="text-gray-400 text-sm ">
                      Podrás reenviar el código en:{" "}
                      <span className="font-mono font-bold text-amber-300/80">
                        {formatTime(timeRemaining)}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    user && handleResendEmail(user);
                  }}
                  disabled={!canResend}
                  className=" cursor-pointer text-slate-300/80 hover:text-slate-300 transition flex items-center gap-2 disabled:opacity-50 disabled:hover:text-slate-300/80  disabled:cursor-not-allowed "
                >
                  {loadingResender ? (
                    <div className="flex items-center gap-3 text-slate-300/80">
                      Reenviando email
                      <TinyLoader />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 ">
                      <p>Reenviar código</p>
                      <span>
                        <FaArrowRotateRight />
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center mb-6">Iniciá sesión para ingresar a tu cuenta.</p>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu email"
                {...formik.getFieldProps("email")}
                className={`w-full h-12 rounded-md bg-background2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                  formik.touched.email && formik.errors.email ? "border border-amber-400/50" : ""
                }`}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.email}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  {...formik.getFieldProps("password")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.password && formik.errors.password ? "border border-amber-400/50" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                  <p className="text-amber-300 text-sm flex items-center gap-2">
                    <FaExclamation className="shrink-0" size={16} />
                    <span>{formik.errors.password}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              onClick={() => {
                formik.setTouched({
                  email: true,
                  password: true,
                });
              }}
              disabled={formik.isSubmitting}
              className="bg-button/90 hover:bg-button cursor-pointer transition rounded-md py-2 mt-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Iniciando..." : "Iniciar sesión"}
            </button>

            {/* Botón "Olvidé mi contraseña" */}
            <div className="text-center mt-3 mb-2">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-accent-light hover:text-accent-medium transition-colors text-sm underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-border/80"></div>
              <span className="px-2 text-gray-medium-light text-xl">o</span>
              <div className="flex-1 h-px bg-border/80"></div>
            </div>
            <div className="flex gap-4 justify-center ">
              <GoogleAuthButton isLoginPage={true} />
              <GitHubAuthButton isLoginPage={true} />
            </div>

            <p className="text-center text-gray-400 text-sm mt-2">
              ¿Todavía no tenés una cuenta?{" "}
              <Link href="/register" className="text-accent-medium hover:underline">
                Registrate
              </Link>
              <span className="items-center text-xl">&rarr;</span>
            </p>
          </div>
        </form>
      </section>

      {/* Modal de "Olvidé mi contraseña" */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default LoginForm;
