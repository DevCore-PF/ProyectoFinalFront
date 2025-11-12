import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
