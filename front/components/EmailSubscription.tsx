"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toastSuccess } from "@/helpers/toast";

interface EmailFormValues {
  email: string;
}

const EmailSubscription = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const formik = useFormik<EmailFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("Tu email es requerido"),
    }),
    onSubmit: async (values) => {
      setIsSubscribing(true);
      // simulacion de api call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Newsletter subscription:", values.email);
      toastSuccess("¡Te has suscrito al newsletter exitosamente!");
      setIsSubscribing(false);
      formik.resetForm();
    },
  });

  return (
    <div className="space-y-4">
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your e-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 rounded-lg bg-purple-900/50 border-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-purple-700/50"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        
        <button
          type="submit"
          disabled={!formik.isValid || isSubscribing}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubscribing ? "Suscribiendo..." : "Suscribite para recibir ofertas"}
        </button>
      </form>
    </div>
  );
};

export default EmailSubscription;