"use client";
//Icons
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
//Types & Validators
import { LoginFormData } from "@/types/auth.types";
import { loginInitialValues, loginValidations } from "@/validators/loginSchema";
//Formik
import { useFormik } from "formik";
//Next/React
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//Services
import { loginUserService } from "@/services/user.service";
//Helpers
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
//Context
import { useAuth } from "@/context/UserContext";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import GitHubAuthButton from "@/components/GitHubAuthButton";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailNotVerified, setShowEmailNotVerified] = useState(false);
  const router = useRouter();
  const { setToken, setUser, user } = useAuth();
  const formik = useFormik<LoginFormData>({
    initialValues: loginInitialValues,
    validationSchema: loginValidations,
    validateOnMount: false,
    onSubmit: async () => {
      try {
        const data = await loginUserService(formik.values);
        setToken(data.access_token);
        setUser(data.user);
        // toastSuccess("Login exitoso!");
        console.log("esta es mi data", data);

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
  useEffect(() => {
    if (user && !user.isEmailVerified) {
      setShowEmailNotVerified(true);
    }
  }, [user]);
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
          className="border-border border p-4 sm:p-8 rounded-2xl w-full max-w-lg shadow-lg m-10 sm:m-15"
        >
          <h1 className="text-4xl font-bold text-center mb-2">Login</h1>
          {showEmailNotVerified ? (
            <p className="text-red-400 text-center mb-6">
              Debes confirmar tu email para iniciar sesión. Revisa tu bandeja de
              entrada.
            </p>
          ) : (
            <p className="text-gray-400 text-center mb-6">
              Iniciá sesión para ingresar a tu cuenta.
            </p>
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
              <div className="flex-1 h-px bg-border/80"></div>
              <span className="px-2 text-gray-medium-light text-xl">o</span>
              <div className="flex-1 h-px bg-border/80"></div>
            </div>
            <div className="flex gap-4 justify-center ">
              <GoogleAuthButton />
              <GitHubAuthButton />
            </div>

            <p className="text-center text-gray-400 text-sm mt-2">
              ¿Todavía no tenés una cuenta?{" "}
              <Link
                href="/register"
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

export default LoginPage;
