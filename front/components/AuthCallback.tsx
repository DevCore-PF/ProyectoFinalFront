"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { toastError } from "@/helpers/alerts.helper";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/auth.types";
import { getCurrentUserService } from "@/services/user.service";
import Loader from "./Loaders/Loader";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      // Primero verificar si hay errores en los query params
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error || errorDescription) {
        const message = errorDescription 
          ? decodeURIComponent(errorDescription) 
          : "Error en la autenticación";
        toastError(message);
        router.replace("/login");
        return;
      }

      const token = searchParams.get("token");

      if (!token) {
        toastError("Error en la autenticación");
        router.replace("/login?error=no_token");
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        setToken(token);

        const userData = await getCurrentUserService(token, decoded.sub);
        setUser(userData);

        if (decoded.role === "teacher" || decoded.role === "student") {
          window.location.href = "/";
        } else {
          window.location.href = "/role";
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
        toastError("Error al procesar la autenticación");
        router.replace("/login?error=auth_failed");
      }
    };

    handleAuth();
  }, [searchParams, setToken, setUser, router]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <Loader size="medium" />
      <p className="text-slate-400">Redirigiendo...</p>
    </div>
  );
}
