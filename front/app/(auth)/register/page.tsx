import RegisterForm from "@/components/RegisterForm";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPage;
