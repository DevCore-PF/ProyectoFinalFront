"use client";

//Icons
import { GoMortarBoard } from "react-icons/go";
import { HiOutlineComputerDesktop } from "react-icons/hi2";

//Next
import Link from "next/link";
import { updateRoleService } from "@/services/user.services";

import { useFormik } from "formik";
import { roleValidation } from "@/validators/registerSchema";
import { toastError, toastSuccess } from "@/helpers/toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";

const page = () => {
  const router = useRouter();
  const { token, isLoading, setToken, setUser } = useAuth();
  let rol = "";
  const formik = useFormik({
    initialValues: {
      role: "",
    },
    validationSchema: roleValidation,
    onSubmit: async () => {
      try {
        if (token) {
          const data = await updateRoleService(formik.values.role, token);
          console.log("data de rol", data);

          if (data.access_token) {
            setToken(data.access_token);
          }
          setUser(data.user);
          if (formik.values.role === "student") {
            rol = "alumn@";
          } else {
            rol = "profesor";
          }
          toastSuccess(`Has seleccionado ${rol}.
            Revisa tu email para verificar tu cuenta.`);
          router.push("/login");
        }
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
    <form onSubmit={formik.handleSubmit}>
      <div className="min-h-screen text-font-light flex flex-col">
        <header className="p-4">
          <Link href="/">
            <span className="font-semibold">LOGO</span>
          </Link>
        </header>

        <section className="flex flex-col items-center justify-center mt-15 px-4">
          <h1 className="text-2xl sm:text-4xl text-center">
            Bienvenid@ a DevCore.
          </h1>
          <h3 className="text-2xl sm:text-3xl mt-3 text-center">
            Elegí tu perfil:
          </h3>
          <div className="flex flex-col mb-15">
            <div className="flex flex-wrap justify-center gap-8 mt-10 ">
              <span
                onClick={() => handleSelectRole("teacher")}
                className={`shrink-0 flex flex-col gap-10 border-2 p-12 sm:p-20 rounded-[10px] transition-all duration-300 cursor-pointer
              ${
                formik.values.role === "teacher"
                  ? " border-accent-medium/70   shadow-[0_0_15px_#bba0eed4] scale-105"
                  : "border-border hover:scale-105 hover:shadow-[0_0_8px_#474b8a]"
              } bg-background2/50`}
              >
                <GoMortarBoard
                  className="text-[#bfc1de] w-full h-auto max-w-[150px] sm:max-w-[250px]"
                  size={250}
                />
                <p className="text-3xl sm:text-5xl text-center">Profesor</p>
              </span>
              <span
                onClick={() => handleSelectRole("student")}
                className={`shrink-0 flex flex-col gap-10 border-2 p-12 sm:p-20 rounded-[10px] transition-all duration-300 cursor-pointer
              ${
                formik.values.role === "student"
                  ? " border-accent-medium/70   shadow-[0_0_15px_#bba0eed4] scale-105"
                  : "border-border hover:scale-105 hover:shadow-[0_0_8px_#474b8a]"
              } bg-background2/50`}
              >
                <HiOutlineComputerDesktop
                  className="text-[#bfc1de] w-full h-auto max-w-[150px] sm:max-w-[250px]"
                  size={250}
                />
                <p className="text-3xl sm:text-5xl text-center">Alumn@</p>
              </span>
            </div>
          </div>
          <button
            disabled={formik.isSubmitting}
            type="submit"
            onClick={() => {
              formik.setTouched({
                role: true,
              });
            }}
            className="px-5 py-2 border border-font-light rounded-xl mb-10 hover:scale-103 transition-all duration-150 cursor-pointer text-lg sm:text-xl font-light disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            Continuar
          </button>
        </section>
      </div>
    </form>
  );
};

export default page;
