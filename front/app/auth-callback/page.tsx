// app/auth-callback/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter} from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";

export default function AuthCallback() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const { setToken } = useAuth();

  // useEffect(() => {
    // const token = searchParams.get("token");
    // const error = searchParams.get("error");
    // const message = searchParams.get("message");

    // if (error) {
    //   // Manejar diferentes tipos de errores
    //   if (error === "Conflict" || message?.includes("ya está registrado")) {
    //     toastError(
    //       message || "Este email ya está registrado. Por favor, inicia sesión con tu contraseña."
    //     );
    //     router.replace("/login?error=email_conflict");
    //   } else {
    //     toastError(message || "Error en la autenticación con Google");
    //     router.replace("/login?error=auth_failed");
    //   }
    //   return;
    // }

  //   if (token) {
  //     setToken(token);
  //     router.replace("/role");
  //   } else {
  //     toastError("Error en la autenticación");
  //     router.replace("/login?error=no_token");
  //   }
  // }, [searchParams, setToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autenticación con Google...</p>
      </div>
    </div>
  );
}