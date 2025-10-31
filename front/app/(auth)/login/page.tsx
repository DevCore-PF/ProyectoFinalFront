import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
