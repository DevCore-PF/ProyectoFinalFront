import AuthCallback from "@/components/AuthCallback";
import { Suspense } from "react";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Cargando autenticación...</div>}>
      <AuthCallback />
    </Suspense>
  );
}
