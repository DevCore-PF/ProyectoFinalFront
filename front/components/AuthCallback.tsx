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
      const token = searchParams.get("token");
      console.log("TOKEN AOUTHCALLBACK:", token);

      if (!token) {
        toastError("Error en la autenticación");
        router.replace("/login?error=no_token");
        return;
      }

      try {
        // Decodificar el JWT para obtener el payload
        const decoded = jwtDecode<JwtPayload>(token);

        console.log("TOKEN DECO AOUTHCALLBACK:", decoded);
        // Guardar el token primero
        setToken(token);

        // Obtener los datos completos del usuario desde el backend
        const userData = await getCurrentUserService(token, decoded.sub);

        console.log("USER AOUTHCALLBACK:", userData);
        // Setear el usuario en el context
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
    <div>
      <Loader />
    </div>
  );
}
