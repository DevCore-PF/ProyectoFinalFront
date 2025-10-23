"use client";
//Icons
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

//Helpers
import { toastSuccess } from "@/helpers/toast";

//Formik
import {
  registerInitialValues,
  registerValidations,
} from "@/validators/registerSchema";
import { useFormik } from "formik";

//Next
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const page = () => {
  const [show, setShow] = useState(false);
  const [showR, setShowR] = useState(false);
  const handleShowPass = () => {
    setShow(!show);
  };
  const handleShowRPass = () => {
    setShowR(!showR);
  };
  const formik = useFormik({
    validationSchema: registerValidations,
    initialValues: registerInitialValues,

    onSubmit: () => {
      const data = formik.values;
      console.log(data);
      toastSuccess("Usuario registrado!");
      // try {
      // } catch (error) {
      //   throw new Error(error as string);
      // } finally {
      //   formik.setSubmitting(false);
      // }
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
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ingresá tu nombre"
                className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                  formik.touched.name && formik.errors.name
                    ? "border border-red-500"
                    : ""
                }`}
              />
              {formik.errors.name && formik.touched.name ? (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ingresá tu email"
                className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                  formik.touched.email && formik.errors.email
                    ? "border border-red-500"
                    : ""
                }`}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ingresá tu contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.password && formik.errors.password
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={handleShowPass}
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {show ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              {formik.errors.password && formik.touched.password ? (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="repeatPassword" className="block text-sm mb-1">
                Repetir Contraseña
              </label>
               <div className="relative">
                <input
                  type={showR ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ingresá tu contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              {formik.errors.repeatPassword && formik.touched.repeatPassword ? (
                <p className="text-red-400 text-sm text-center mt-2">
                  {formik.errors.repeatPassword}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-start sm:items-center gap-2 text-xs text-gray-300">
              <label className="inline-flex items-start sm:items-center cursor-pointer w-full sm:w-auto">
                <input type="checkbox" className="sr-only" />
                <div className="w-5 h-5 border border-border rounded-[5px] flex-shrink-0 flex items-center justify-center mt-0.5">
                  <div className="w-3 h-2.5 bg-accent-dark rounded-xs hidden checkbox-indicator"></div>
                </div>
                <label
                  htmlFor="terms"
                  className="ml-2 select-none text-sm leading-snug sm:leading-normal"
                >
                  Acepto los{" "}
                  <span className="underline cursor-pointer text-accent-medium">
                    Términos de Uso
                  </span>{" "}
                  y las{" "}
                  <span className="underline cursor-pointer text-accent-medium">
                    Políticas de Privacidad
                  </span>
                </label>
              </label>
            </div>

            <button
              type="submit"
              className="bg-button/90 hover:bg-button cursor-pointer transition rounded-md py-2 mt-2 font-semibold"
            >
              Registrarme
            </button>

            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-medium-dark"></div>
              <span className="px-2 text-gray-medium-light text-xl">o</span>
              <div className="flex-1 h-px bg-gray-medium-dark"></div>
            </div>

            <button className="flex items-center justify-center gap-2 bg-font-light cursor-pointer text-font-dark py-2 rounded-md hover:bg-gray-100 transition text-xs sm:text-base px-3 sm:px-4 text-center">
              <Image
                src="/icons/googleIcon.svg"
                width={18}
                height={18}
                alt="Ícono de Google"
                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
              />
              <span className="text-ellipsis overflow-hidden text-center">
                Registro con Google
              </span>
            </button>

            <p className="text-center text-gray-400 text-sm mt-2">
              ¿Ya tenés una cuenta?{" "}
              <Link href="/login" className="text-accent-medium underline">
                Ingresá
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
