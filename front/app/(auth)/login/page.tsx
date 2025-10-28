"use client";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

import {
  LoginType,
  loginInitialValues,
  loginValidations,
} from "@/validators/loginSchema";
import { useFormik } from "formik";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { loginUserService } from "@/services/user.services";
import { toastError, toastSuccess } from "@/helpers/toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const formik = useFormik<LoginType>({
    initialValues: loginInitialValues,
    validationSchema: loginValidations,
    validateOnMount: false,
    onSubmit: async () => {
      try {
        const data = await loginUserService(formik.values);
        toastSuccess("Login exitoso!");
        router.push("/");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <h1 className="text-4xl font-bold text-center mb-2">Login</h1>
          <p className="text-gray-400 text-center mb-6">
            Iniciá sesión para ingresar a tu cuenta.
          </p>

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
                  formik.touched.email && formik.errors.email
                    ? "border border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  {...formik.getFieldProps("password")}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.password && formik.errors.password
                      ? "border border-red-500"
                      : ""
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
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* <div className="flex items-center gap-2 text-xs text-gray-300">
              <label className="inline-flex items-center cursor-pointer ">
                <input type="checkbox" className="sr-only" />
                <div className="w-5 h-5 border border-border rounded-[5px] flex items-center justify-center">
                  <div className="w-3 h-2.5 bg-accent-dark rounded-xs hidden checkbox-indicator"></div>
                </div>
                <label htmlFor="terms" className="ml-2 select-none text-sm ">
                  Recordarme
                </label>
              </label>
            </div> */}

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

            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-medium-dark"></div>
              <span className="px-2 text-gray-medium-light text-xl">o</span>
              <div className="flex-1 h-px bg-gray-medium-dark"></div>
            </div>

            <button
              disabled={formik.isSubmitting}
              className="flex items-center justify-center gap-2 bg-font-light cursor-pointer text-font-dark py-2 rounded-md hover:bg-gray-100 transition text-xs sm:text-base px-3 sm:px-4 text-center"
            >
              <Image
                src="/icons/googleIcon.svg"
                width={18}
                height={18}
                alt="Ícono de Google"
                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
              />
              <span className="text-ellipsis overflow-hidden text-center">
                Ingresá con Google
              </span>
            </button>

            <p className="text-center text-gray-400 text-sm mt-2">
              ¿Todavía no tenés una cuenta?{" "}
              <Link
                href="/register"
                className="text-accent-medium hover:underline"
              >
                Registrate
              </Link>
              <span className="items-center text-xl">&rarr;</span>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
