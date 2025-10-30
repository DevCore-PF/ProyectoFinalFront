"use client";
//Next/React
import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
//Context
import { useAuth } from "@/context/UserContext";
//jwtDecode
import { jwtDecode } from "jwt-decode";
//Helpers
import { toastSuccess } from "@/helpers/alerts.helper";
//Services
import { getCurrentUserService } from "@/services/user.service";

// Componente interno que usa useSearchParams
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUser } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    const fetchCurrentService = async () => {
      if (token) {
        try {
          setToken(token);

          const decoded: any = jwtDecode(token);
          const userData = await getCurrentUserService(token, decoded.sub);
          setUser(userData);
          if (decoded.role) {
            toastSuccess("Login exitoso!");
            router.push("/");
          } else {
            router.push("/role");
          }
        } catch (error) {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };
    fetchCurrentService();
  }, [searchParams, router, setToken, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Autenticando...</p>
        <p className="text-sm text-gray-500 mt-2">
          Serás redirigido en un momento
        </p>
      </div>
    </div>
  );
}

// Componente de loading
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Cargando...</p>
      </div>
    </div>
  );
}

// Componente principal exportado
export default function AuthCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
