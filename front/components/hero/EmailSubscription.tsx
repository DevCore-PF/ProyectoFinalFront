"use client";
//Next/React
import { useState } from "react";
//Icons
import { FaExclamation } from "react-icons/fa6";
//Helpers
import { toastSuccess } from "@/helpers/alerts.helper";
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Newsletter subscription:", values.email);
      toastSuccess("Te has suscrito al newsletter!");
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
    <div className="max-w-7xl mx-auto mb-6 px-4 sm:px-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-br from-button/10 to-purple-500/10 rounded-2xl blur-2xl group-hover:from-button/20 group-hover:to-purple-500/10 transition-all duration-500"></div>
        <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-4 sm:p-6 hover:border-slate-600/70 transition-all duration-300">
          <div className="flex flex-col">
            <h3 className="text-font-light font-semibold text-lg sm:text-xl mb-2 text-center">
              Ofertas exclusivas
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-4 text-center px-2">
              Suscríbete para recibir descuentos y contenido exclusivo
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-center"
            >
              <input
                type="email"
                placeholder="Ingresa tu email"
                {...formik.getFieldProps("email")}
                className={`w-full sm:w-1/2 h-11 rounded-lg bg-slate-900/60 backdrop-blur-sm border px-3 sm:px-4 text-xs sm:text-sm text-font-light placeholder:text-slate-400 focus:outline-none transition-all ${
                  showErrors && formik.errors.email
                    ? "border-amber-400/50 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50"
                    : "border-slate-700/50 focus:border-button/50 focus:ring-1 focus:ring-button/50"
                }`}
              />

              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full sm:w-auto sm:min-w-[140px] h-10 sm:h-11 text-xs sm:text-sm bg-button hover:bg-[#6d3dc4] text-font-light font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-102 active:scale-95 hover:shadow-lg hover:shadow-button/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubscribing ? "Suscribiendo..." : "Suscribirme"}
              </button>
            </form>
            {showErrors && formik.errors.email && (
              <div className="px-3 py-2 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto mt-3 bg-amber-500/10 border flex items-center justify-center border-amber-500/30 rounded-lg">
                <p className="text-amber-300 text-xs flex items-center gap-2">
                  <FaExclamation className="shrink-0" size={14} />
                  <span>{formik.errors.email}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSubscription;
