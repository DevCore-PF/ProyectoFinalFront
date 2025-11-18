"use client";
//Helpers
import { toastSuccess } from "@/helpers/alerts.helper";
//Formik
import { useFormik } from "formik";
import {
  contactInitialValues,
  contactValidations,
} from "@/validators/contactSchema";
//Icons
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot, FaExclamation } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
//Next
import Link from "next/link";
//Types
import { ContactFormData } from "../../../../types/forms.types";

const ContactPage = () => {
  const formik = useFormik<ContactFormData>({
    validationSchema: contactValidations,
    initialValues: contactInitialValues,
    onSubmit: () => {
      toastSuccess("Tu mensaje ha sido enviado!");
    },
  });

  return (
    <div className="min-h-screen text-font-light pb-4 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="inline-flex px-4 py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-6 sm:mb-8">
        <span className="text-font-light font-semibold text-sm sm:text-base md:text-lg">
          Contáctanos
        </span>
      </div>
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 lg:gap-0">
        <div className="border-border border w-full lg:rounded-l-2xl rounded-2xl lg:rounded-r-none p-4 sm:p-6 md:p-8 shadow-xl">
          <div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  {...formik.getFieldProps("name")}
                  placeholder="Ingresa tu nombre"
                  className={`w-full h-10 sm:h-12 rounded-md bg-background2 px-3 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.name && formik.errors.name
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="px-2 sm:px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={14} />
                      <span>{formik.errors.name}</span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm mb-1">
                  Email *
                </label>
                <input
                  type="text"
                  id="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Ingresa tu Email"
                  className={`w-full h-10 sm:h-12 rounded-md bg-background2 px-3 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.email && formik.errors.email
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="px-2 sm:px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={14} />
                      <span>{formik.errors.email}</span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs sm:text-sm mb-1">
                  Motivo *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...formik.getFieldProps("subject")}
                  placeholder="Ingresa el nomtivo"
                  className={`w-full h-10 sm:h-12 rounded-md bg-background2 px-3 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.subject && formik.errors.subject
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.subject && formik.touched.subject && (
                  <div className="px-2 sm:px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={14} />
                      <span>{formik.errors.subject}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-2 sm:mt-6">
                <label htmlFor="message" className="block text-xs sm:text-sm mb-1">
                  Mensaje *
                </label>
                <textarea
                  maxLength={300}
                  id="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Escribe tu mensaje"
                  className={`w-full h-24 sm:h-28 rounded-md bg-background2 p-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 resize-none ${
                    formik.touched.message && formik.errors.message
                      ? "border border-amber-400/50"
                      : ""
                  }`}
                />
                {formik.errors.message && formik.touched.message && (
                  <div className="px-2 sm:px-3 py-2 bg-amber-500/10 border flex justify-center border-amber-500/30 rounded-lg mt-2">
                    <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <FaExclamation className="shrink-0" size={14} />
                      <span>{formik.errors.message}</span>
                    </p>
                  </div>
                )}
                <p
                  className={`text-xs sm:text-sm flex justify-end mr-2 ${
                    formik.values.message.length === 300
                      ? "text-orange-400"
                      : formik.values.message.length >= 250
                      ? "text-yellow-200"
                      : "text-font-light/50"
                  }`}
                >
                  {formik.values.message.length}/300
                </p>
              </div>
              <button
                type="submit"
                onClick={() => {
                  formik.setTouched({
                    name: true,
                    email: true,
                    subject: true,
                    message: true,
                  });
                }}
                disabled={formik.isSubmitting}
                className="bg-button/90 hover:bg-button cursor-pointer self-center flex transition rounded-md py-2 sm:py-2.5 mt-2 px-4 sm:px-6 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base font-medium"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>

        <div className="bg-background2 lg:rounded-r-2xl rounded-2xl lg:rounded-l-none w-full lg:w-1/2 p-4 sm:p-6 md:p-8 shadow-xl flex flex-col justify-between gap-3 sm:gap-4">
          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-3 sm:p-4 md:p-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-3 sm:mb-4 border border-[#5a5d8e]">
              <IoMail size={18} className="text-[#BFC1DE] sm:w-[22px] sm:h-[22px]" />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm text-center break-all">devcoreacademia@gmail.com</p>
          </div>

          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-3 sm:p-4 md:p-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-3 sm:mb-4 border border-[#5a5d8e]">
              <FaPhone size={16} className="text-[#BFC1DE] sm:w-[20px] sm:h-[20px]" />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">+91 00000 00000</p>
          </div>

          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-3 sm:p-4 md:p-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-3 sm:mb-4 border border-[#5a5d8e]">
              <FaLocationDot size={18} className="text-[#BFC1DE] sm:w-[22px] sm:h-[22px]" />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">En algún lugar del mundo</p>
          </div>

          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-3 sm:p-4 md:p-5">
            <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Link
                target="_blank"
                href="http://www.facebook.com"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[rgb(90,93,142)]"
              >
                <FaFacebook size={18} className="text-[#BFC1DE] sm:w-[22px] sm:h-[22px]" />
              </Link>
              <Link
                target="_blank"
                href="http://www.twitter.com"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                <FaXTwitter size={17} className="text-[#BFC1DE] sm:w-[21px] sm:h-[21px]" />
              </Link>
              <Link
                target="_blank"
                href="http://www.linkedin.com"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                <FaLinkedin size={18} className="text-[#BFC1DE] sm:w-[22px] sm:h-[22px]" />
              </Link>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">Perfiles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
