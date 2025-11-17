"use client";
//Icons
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
//Helpers
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/helpers/alerts.helper";
//Formik
import {
  registerInitialValues,
  registerValidations,
} from "@/validators/registerSchema";
import { useFormik } from "formik";
//Next / React
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
//Types
import { RegisterFormData, RegisterResponse } from "@/types/auth.types";
//Services
import { registerUserService } from "@/services/user.service";
//Context
import { useAuth } from "@/context/UserContext";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import GitHubAuthButton from "@/components/GitHubAuthButton";
import Image from "next/image";
import Loader from "@/components/Loaders/Loader";

const RegisterForm = () => {
  const { setToken, setUser, isLoading, user } = useAuth();
  const [registerLoading, setRegisterLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showR, setShowR] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShowPass = () => {
    setShow(!show);
  };
  const handleShowRPass = () => {
    setShowR(!showR);
  };

  const formik = useFormik<RegisterFormData>({
    validationSchema: registerValidations,
    initialValues: registerInitialValues,
    validateOnMount: false,

    onSubmit: () => {
      toastConfirm(
        "Enviar formulario",
        async () => {
          try {
            setRegisterLoading(true);
            const data: RegisterResponse = await registerUserService(
              formik.values
            );
            setToken(data.access_token);
            setUser(data.userReturn);
            formik.resetForm();
            window.location.href = "/role";
          } catch (error) {
            if (error instanceof Error) {
              toastError(error.message);
            } else {
              toastError("Error desconocido");
            }
          } finally {
            setRegisterLoading(false);
            formik.setSubmitting(false);
          }
        },
        () => {
          formik.setSubmitting(false);
          setRegisterLoading(false);
        }
      );
    },
  });

  useEffect(() => {
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    if (error && error_description) {
      toastError(decodeURIComponent(error_description));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  if (isLoading) return <Loader />;
  return (
    <>
      {user ? (
        <Loader />
      ) : registerLoading ? (
        <div className="flex flex-col min-h-screen justify-center items-center">
          <Loader size="medium" />
          <p className="text-slate-400">Enviando registro...</p>
        </div>
      ) : (
        <div className="min-h-screen text-font-light flex flex-col">
          <header className="p-6">
            <div className="flex  gap-2 items-center text-[1.5rem] font-medium  ">
              <Link
                href={"/"}
                className="flex items-center space-x-2 cursor-pointer"
              >
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

          <section className="flex flex-1 justify-center items-center sm:px-4">
            <form
              onSubmit={formik.handleSubmit}
              className="border-border border p-4 sm:p-8 rounded-2xl w-full max-w-lg shadow-lg m-10 sm:m-15"
            >
              <h1 className="text-4xl font-bold text-center mb-2">Registro</h1>
              <p className="text-gray-400 text-center mb-6">
                Creá una cuenta nueva en DevCore.
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...formik.getFieldProps("name")}
                    placeholder="Ingresa tu nombre"
                    className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.name && formik.errors.name
                        ? "border border-amber-400/50"
                        : ""
                    }`}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                      <p className="text-amber-300 text-sm flex items-center gap-2">
                        <FaExclamation className="shrink-0" size={16} />
                        <span>{formik.errors.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps("email")}
                    placeholder="Ingresa tu email"
                    className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                      formik.touched.email && formik.errors.email
                        ? "border border-amber-400/50"
                        : ""
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
                      type={show ? "text" : "password"}
                      id="password"
                      placeholder="Crea tu contraseña"
                      {...formik.getFieldProps("password")}
                      className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                        formik.touched.password && formik.errors.password
                          ? "border border-amber-400/50"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleShowPass}
                      className="absolute right-3 cursor-pointer  top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {show ? <FaRegEyeSlash /> : <FaRegEye />}
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm mb-1"
                  >
                    Repetir Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showR ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      {...formik.getFieldProps("confirmPassword")}
                      className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border border-amber-400/50"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleShowRPass}
                      className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showR ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  {formik.errors.confirmPassword &&
                    formik.touched.confirmPassword && (
                      <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                        <p className="text-amber-300 text-sm flex items-center gap-2">
                          <FaExclamation className="shrink-0" size={16} />
                          <span>{formik.errors.confirmPassword}</span>
                        </p>
                      </div>
                    )}
                </div>

                <div className="flex flex-wrap items-start sm:items-center gap-2 text-xs text-gray-300">
                  <label
                    htmlFor="checkBoxTerms"
                    className="inline-flex items-start sm:items-center cursor-pointer w-full sm:w-auto"
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
                    <span className="ml-2 select-none text-sm leading-snug sm:leading-normal">
                      Acepto los{" "}
                      <Link
                        href={"/terms"}
                        className="text-accent-medium hover:underline"
                      >
                        Términos y Condiciones
                      </Link>{" "}
                      y las{" "}
                      <Link
                        href={"/privacy-policy"}
                        className="text-accent-medium hover:underline"
                      >
                        Políticas de Privacidad
                      </Link>
                    </span>
                  </label>
                  {formik.errors.checkBoxTerms &&
                    formik.touched.checkBoxTerms && (
                      <div className="px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
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
                      name: true,
                      email: true,
                      password: true,
                      confirmPassword: true,
                      checkBoxTerms: true,
                    });
                  }}
                  disabled={formik.isSubmitting}
                  className="bg-button/90 hover:bg-button cursor-pointer transition rounded-md py-2 mt-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-button/90 flex items-center justify-center gap-2"
                >
                  {formik.isSubmitting ? (
                    <>
                      {/* <Spinner size="sm" /> */}
                      <span>Registrando...</span>
                    </>
                  ) : (
                    "Registrarme"
                  )}
                </button>

                <div className="flex items-center my-2">
                  <div className="flex-1 h-px bg-border/80"></div>
                  <span className="px-2 text-gray-medium-light text-xl">o</span>
                  <div className="flex-1 h-px bg-border/80"></div>
                </div>
                <div className="flex gap-4 justify-evenly sm:justify-center ">
                  <GoogleAuthButton isLoginPage={false} />
                  <GitHubAuthButton isLoginPage={false} />
                </div>
                <p className="text-center text-gray-400 text-sm mt-2">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href="/login"
                    className="text-accent-medium hover:underline"
                  >
                    Ingresa
                  </Link>
                  <span className="items-center text-xl">&rarr;</span>
                </p>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default RegisterForm;
