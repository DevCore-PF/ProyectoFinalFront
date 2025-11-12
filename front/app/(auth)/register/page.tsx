import RegisterForm from "@/components/RegisterForm";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPage;
