"use client";
//Helpers
import { toastSuccess } from "@/helpers/toast";
//Formik
import { useFormik } from "formik";
import {
  contactInitialValues,
  contactValidations,
} from "@/validators/contactSchema";
//Icons
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

//Next
import Link from "next/link";

const ContactPage = () => {
  const formik = useFormik({
    validationSchema: contactValidations,
    initialValues: contactInitialValues,
    onSubmit: () => {
      toastSuccess("Tu mensaje ha sido enviado!");
    },
  });

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">Contáctanos</h1>

      <div className=" w-full max-w-6xl flex ">
        <div className=" border-border border w-full rounded-l-2xl p-8 shadow-xl">
          <div>
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="block text-sm mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  {...formik.getFieldProps("name")}
                  placeholder="Ingresa tu nombre"
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.name && formik.errors.name
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {formik.errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email *
                </label>
                <input
                  type="text"
                  id="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Ingresa tu Email"
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.email && formik.errors.email
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {formik.errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm mb-1">
                  Motivo *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...formik.getFieldProps("subject")}
                  placeholder="Ingresa el nomtivo"
                  className={`w-full h-12 rounded-md bg-background2 px-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.subject && formik.errors.subject
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {formik.errors.subject && formik.touched.subject && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {formik.errors.subject}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="block text-sm mb-1">
                  Mensaje *
                </label>
                <textarea
                  maxLength={300}
                  id="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Escribe tu mensaje"
                  className={`w-full h-28 rounded-md bg-background2 p-3  text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/50 ${
                    formik.touched.message && formik.errors.message
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                {formik.errors.message && formik.touched.message && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    {formik.errors.message}
                  </p>
                )}
                <p
                  className={`text-sm flex justify-end mr-2 ${
                    formik.values.message.length === 300
                      ? "text-red-400"
                      : formik.values.message.length >= 250
                      ? "text-yellow-400"
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
                className="bg-button/90 hover:bg-button cursor-pointer self-center flex transition rounded-md py-2 mt-2 px-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>

        <div className="bg-background2 rounded-r-2xl w-1/2 p-8 shadow-xl flex flex-col justify-between">
          <div className=" flex flex-col justify-center items-center border-border-light border rounded-md p-5">
            <div className="w-12 h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-4 border border-[#5a5d8e]">
              <IoMail size={22} className="text-[#BFC1DE]" />
            </div>
            <p className="text-gray-300 text-sm">devcoreacademia@gmail.com</p>
          </div>

          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-5">
            <div className="w-12 h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-4 border border-[#5a5d8e]">
              <FaPhone size={20} className="text-[#BFC1DE]" />
            </div>
            <p className="text-gray-300 text-sm">+91 00000 00000</p>
          </div>

          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-5">
            <div className="w-12 h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-4 border border-[#5a5d8e]">
              <FaLocationDot size={22} className="text-[#BFC1DE]" />
            </div>
            <p className="text-gray-300 text-sm">En algún lugar del mundo</p>
          </div>

          <div className="flex flex-col justify-center items-center border-border-light border rounded-md p-5">
            <div className="flex gap-3 mb-3">
              <Link
                target="_blank"
                href="http://www.facebook.com"
                className="w-10 h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[rgb(90,93,142)]"
              >
                <FaFacebook size={22} className="text-[#BFC1DE]" />
              </Link>
              <Link
                target="_blank"
                href="http://www.twitter.com"
                className="w-10 h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                <FaXTwitter size={21} className="text-[#BFC1DE]" />
              </Link>
              <Link
                target="_blank"
                href="http://www.linkedin.com"
                className="w-10 h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                <FaLinkedin size={22} className="text-[#BFC1DE]" />
              </Link>
            </div>
            <p className="text-gray-300 text-sm">Perfiles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
