"use client";
//Icons
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

//Helpers
import { toastConfirm, toastError, toastSuccess } from "@/helpers/toast";

//Formik
import {
  registerInitialValues,
  registerValidations,
} from "@/validators/registerSchema";
import { useFormik } from "formik";

//Next / React
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//Types
import { RegisterType } from "../../../validators/registerSchema";
//Services
import { registerUserService } from "@/services/user.services";
//Context
import { useAuth } from "@/context/UserContext";
const page = () => {
  const { setToken, setUser } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [showR, setShowR] = useState(false);
  const handleShowPass = () => {
    setShow(!show);
  };
  const handleShowRPass = () => {
    setShowR(!showR);
  };

  const formik = useFormik<RegisterType>({
    validationSchema: registerValidations,
    initialValues: registerInitialValues,
    validateOnMount: false,

    onSubmit: () => {
      toastConfirm(
        "Enviar formulario",
        async () => {
          try {
            const data = await registerUserService(formik.values);
            setToken(data.access_token);
            setUser(data.user);
            toastSuccess("Registro enviado!");

            formik.resetForm();
            router.replace("/role");
          } catch (error) {
            if (error instanceof Error) {
              if (error.message === "El correo electrónico ya está en uso") {
                toastError(error.message);
              } else if (
                error.message === "Debe aceptar lo terminos y condiciones"
              ) {
                toastError(error.message);
              }
            } else {
              toastError("Error desconocido");
            }
          } finally {
            formik.setSubmitting(false);
          }
        },
        () => {
          formik.setSubmitting(false);
        }
      );
    },
  });

  return (
    <div className="min-h-screen text-font-light flex flex-col">
      <header className="p-4">
        <Link href="/">
          <span className="font-semibold">LOGO</span>
        </Link>
      </header>

      <section className="flex flex-1 justify-center items-center px-4">
        <form
          onSubmit={formik.handleSubmit}
          className="border-border border p-8 rounded-2xl w-full max-w-lg shadow-lg m-15"
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
                    ? "border border-red-500"
                    : ""
                }`}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.name}
                </p>
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
                    ? "border border-red-500"
                    : ""
                }`}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.email}
                </p>
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
                      ? "border border-red-500"
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
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-1">
                Repetir Contraseña
              </label>
              <div className="relative">
                <input
                  type={showR ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  {...formik.getFieldProps("confirmPassword")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.password && formik.errors.password
                      ? "border border-red-500"
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
                  <p className="text-red-400 text-sm text-center mt-2">
                    {formik.errors.confirmPassword}
                  </p>
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
                    className={`w-3 h-3 text-white transition-opacity ${
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
                    href={"/privacyPolicy"}
                    className="text-accent-medium hover:underline"
                  >
                    Políticas de Privacidad
                  </Link>
                </span>
              </label>
              {formik.errors.checkBoxTerms && formik.touched.checkBoxTerms && (
                <p className="text-red-400 flex items-center justify-center text-sm text-center">
                  {formik.errors.checkBoxTerms}
                </p>
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
              className="bg-button/90 hover:bg-button cursor-pointer transition rounded-md py-2 mt-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-button/90"
            >
              Registrarme
            </button>

            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-medium-dark"></div>
              <span className="px-2 text-gray-medium-light text-xl">o</span>
              <div className="flex-1 h-px bg-gray-medium-dark"></div>
            </div>

            <button
              disabled={formik.isSubmitting}
              className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 gap-2 bg-font-light cursor-pointer text-font-dark py-2 rounded-md hover:bg-gray-100 transition text-xs sm:text-base px-3 sm:px-4 text-center "
            >
              <Image
                src="/icons/googleIcon.svg"
                width={18}
                height={18}
                alt="Ícono de Google"
                className="w-4 h-4 sm:w-[18px] sm:h-[18px] "
              />
              <span className="text-ellipsis overflow-hidden text-center">
                Registro con Google
              </span>
            </button>

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
  );
};

export default page;
