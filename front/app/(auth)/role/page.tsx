"use client";

//Icons
import { GoMortarBoard } from "react-icons/go";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { FaCheckDouble } from "react-icons/fa6";

// Next/React
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
//Services
import { updateRoleService } from "@/services/user.service";
//Formik
import { useFormik } from "formik";
//Validators/Types
import { roleValidation } from "@/validators/registerSchema";
import { RoleData } from "@/types/forms.types";
//Helpers
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
//Context
import { useAuth } from "@/context/UserContext";

const page = () => {
  const router = useRouter();
  const { token, isLoading, setToken, setUser, user } = useAuth();
  const isSubmittingRole = useRef(false);
  let rol = "";

  const formik = useFormik<RoleData>({
    initialValues: {
      role: "",
    },
    validationSchema: roleValidation,
    onSubmit: async () => {
      try {
        isSubmittingRole.current = true;

        if (token) {
          const data = await updateRoleService(formik.values.role, token);

          if (data.access_token) {
            setToken(data.access_token);
          }
          setUser(data.user);

          const rol = formik.values.role === "student" ? "alumn@" : "profesor";

          if (data.user.isEmailVerified) {
            toastSuccess("Login exitoso!");
            router.push("/");
          } else {
            toastSuccess(
              `Has seleccionado ${rol}. Revisa tu email para verificar tu cuenta.`
            );
            router.push("/login");
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toastError(error.message);
        } else {
          toastError("Error desconocido");
        }
        isSubmittingRole.current = false;
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // Solo redirigir si NO estamos en proceso de submit
    if (user && user.role && !isSubmittingRole.current) {
      toastSuccess("Login exitoso!");
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (formik.errors.role) {
      toastError(formik.errors.role);
    }
  }, [formik.errors.role]);

  useEffect(() => {
    if (!isLoading && !token) {
      toastError("No estás autenticado");
      router.push("/register");
    }
  }, [token, isLoading, router]);

  const handleSelectRole = (role: string) => {
    formik.setFieldValue("role", role);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <form onSubmit={formik.handleSubmit} className="min-h-screen ">
      <div className="min-h-screen text-font-light flex flex-col">
        <header className="p-6 backdrop-blur-sm">
          <Link href="/" className="inline-block">
            <span className="text-xl font-bold text-font-light hover:opacity-80 transition-opacity">
              LOGO
            </span>
          </Link>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-5xl w-full space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-font-light via-accent-light to-font-light bg-clip-text text-transparent animate-gradient">
                Bienvenid@ a DevCore
              </h1>
              <p className="text-xl sm:text-2xl text-font-light/70 font-light">
                Elige tu perfil para comenzar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div
                onClick={() => handleSelectRole("teacher")}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer
                  ${
                    formik.values.role === "teacher"
                      ? "scale-105 shadow-2xl shadow-accent-medium/40"
                      : "hover:scale-102 shadow-lg hover:shadow-xl"
                  }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-accent-medium/10 to-transparent transition-opacity duration-500
                    ${
                      formik.values.role === "teacher"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                ></div>

                <div
                  className={`relative border-2 rounded-2xl p-8 sm:p-12 backdrop-blur-sm transition-all duration-500
                    ${
                      formik.values.role === "teacher"
                        ? "border-accent-medium bg-background2/80"
                        : "border-border bg-background2/50 group-hover:border-accent-medium/50"
                    }`}
                >
                  <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                      <div
                        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500
                          ${
                            formik.values.role === "teacher"
                              ? "opacity-30 bg-accent-medium"
                              : "opacity-0 group-hover:opacity-20 group-hover:bg-accent-medium"
                          }`}
                      ></div>
                      <GoMortarBoard
                        className={`relative text-[#bfc1de] transition-all duration-300 w-32 h-32 sm:w-40 sm:h-40
                          ${
                            formik.values.role === "teacher"
                              ? "scale-110 drop-shadow-[0_0_15px_rgba(187,160,238,0.5)]"
                              : "group-hover:scale-105"
                          }`}
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-3xl sm:text-4xl font-semibold">
                        Profesor
                      </h3>
                      <p className="text-sm sm:text-base text-font-light/60 max-w-xs">
                        Crea cursos y comparte tu conocimiento
                      </p>
                    </div>

                    {formik.values.role === "teacher" && (
                      <div className="absolute top-4 right-4">
                        <IoMdCheckmarkCircleOutline size={29} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleSelectRole("student")}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
                  ${
                    formik.values.role === "student"
                      ? "scale-105 shadow-2xl shadow-accent-medium/40"
                      : "hover:scale-102 shadow-lg hover:shadow-xl"
                  }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-accent-medium/10 to-transparent transition-opacity duration-500
                    ${
                      formik.values.role === "student"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                ></div>

                <div
                  className={`relative border-2 rounded-2xl p-8 sm:p-12 backdrop-blur-sm transition-all duration-500
                    ${
                      formik.values.role === "student"
                        ? "border-accent-medium bg-background2/80"
                        : "border-border bg-background2/50 group-hover:border-accent-medium/50"
                    }`}
                >
                  <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                      <div
                        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500
                          ${
                            formik.values.role === "student"
                              ? "opacity-30 bg-accent-medium"
                              : "opacity-0 group-hover:opacity-20 group-hover:bg-accent-medium"
                          }`}
                      ></div>
                      <HiOutlineComputerDesktop
                        className={`relative text-[#bfc1de] transition-all duration-500 w-32 h-32 sm:w-40 sm:h-40
                          ${
                            formik.values.role === "student"
                              ? "scale-110 drop-shadow-[0_0_15px_rgba(187,160,238,0.5)]"
                              : "group-hover:scale-105"
                          }`}
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-3xl sm:text-4xl font-semibold">
                        Alumn@
                      </h3>
                      <p className="text-sm sm:text-base text-font-light/60 max-w-xs">
                        Aprende y desarrolla nuevas habilidades
                      </p>
                    </div>

                    {formik.values.role === "student" && (
                      <div className="absolute top-4 right-4">
                        <IoMdCheckmarkCircleOutline size={29} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                disabled={formik.isSubmitting}
                type="submit"
                onClick={() => {
                  formik.setTouched({
                    role: true,
                  });
                }}
                className={` relative px-10 py-4 rounded-xl text-lg sm:text-xl font-medium
                  transition-all duration-300 overflow-hidden
                  ${
                    formik.isSubmitting
                      ? "cursor-not-allowed opacity-50"
                      : "px-6 sm:px-8 py-3 bg-button/90 hover:bg-button text-font-ligh font-semibold rounded-lg transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95"
                  }
                  bg-button/70
                  disabled:from-gray-500 disabled:to-gray-600 disabled:hover:scale-100 disabled:shadow-none`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {formik.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 rounded-full "></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Continuar
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>

                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
};

export default page;
