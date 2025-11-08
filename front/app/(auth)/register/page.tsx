import RegisterForm from "@/components/RegisterForm";
import { Suspense } from "react";

const page = () => {
  <Suspense fallback={<div>Cargando...</div>}>
    <RegisterForm />
  </Suspense>;
};

export default page;
