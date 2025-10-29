"use client";
//React
import { useState } from "react";
//Helpers
import { toastSuccess } from "@/helpers/toast";
//Formik
import { useFormik } from "formik";
import {
  suscriptionFormType,
  suscriptionInitialValues,
  suscriptionValidation,
} from "@/validators/suscriptionSchema";

const EmailSubscription = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const formik = useFormik<suscriptionFormType>({
    initialValues: suscriptionInitialValues,
    validationSchema: suscriptionValidation,
    onSubmit: async (values) => {
      setIsSubscribing(true);
      // simulacion de api call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Newsletter subscription:", values.email);
      toastSuccess("¡Te has suscrito al newsletter exitosamente!");
      setIsSubscribing(false);
      setShowErrors(false);
      formik.resetForm();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    formik.handleSubmit();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute -inset-2 bg-purple-300/10 blur-3xl rounded-lg -z-10"></div>
          <div className="absolute -inset-1 bg-purple-100/20 blur-2xl rounded-lg -z-10"></div>

          <input
            type="email"
            placeholder="Ingresa tu email"
            {...formik.getFieldProps("email")}
            className={`relative w-full h-12 rounded-md bg-font-light/70 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 transition-all placeholder:text-font-dark/60 ${
              showErrors && formik.errors.email ? "border border-red-500" : ""
            }`}
          />
          {showErrors && formik.errors.email && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="relative">
          <div className="absolute -inset-3 bg-purple-100/10 blur-3xl rounded-lg -z-10"></div>

          <div className="absolute -inset-1 bg-gray-500/40 blur-3xl rounded-lg -z-10"></div>
          <button
            type="submit"
            disabled={isSubscribing}
            className="relative w-full text-sm md:text-base py-3 bg-button/90 hover:bg-button text-font-light font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-purple-500/25"
          >
            {isSubscribing
              ? "Suscribiendo..."
              : "Suscribite para recibir ofertas"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailSubscription;
