"use client";

import { toastSuccess } from "@/helpers/toast";
import {
  contactInitialValues,
  contactValidations,
} from "@/validators/contactSchema";
import { useFormik } from "formik";

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
      <h1 className="text-4xl md:text-5xl font-bold mb-12">Contactanos</h1>

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
                  onChange={(e) => {
                    formik.handleChange;
                    formik.setFieldTouched("message", true, true);
                  }}
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
            </div>

            {/* Botón */}
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
              className="bg-button/90 hover:bg-button cursor-pointer transition rounded-md py-2 mt-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar mensaje
            </button>
          </div>
        </div>

        {/* Info de contacto */}
        <div className="bg-background2 rounded-r-2xl w-1/2 p-8 shadow-xl flex flex-col justify-between">
          {/* Email */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-4 border border-[#5a5d8e]">
              {/* <Mail className="text-white" size={24} /> */}
            </div>
            <p className="text-gray-300 text-sm">support@devcore.com</p>
          </div>

          {/* Teléfono */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-4 border border-[#5a5d8e]">
              {/* <Phone className="text-white" size={24} /> */}
            </div>
            <p className="text-gray-300 text-sm">+91 00000 00000</p>
          </div>

          {/* Ubicación */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#2d2f54] rounded-lg flex items-center justify-center mb-4 border border-[#5a5d8e]">
              {/* <MapPin className="text-white" size={24} /> */}
            </div>
            <p className="text-gray-300 text-sm">En algún lugar del mundo</p>
          </div>

          {/* Redes sociales */}
          <div>
            <div className="flex gap-3 mb-3">
              <a
                href="#"
                className="w-10 h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                {/* <Facebook className="text-white" size={20} /> */}
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                {/* <Twitter className="text-white" size={20} /> */}
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#2d2f54] rounded-lg flex items-center justify-center hover:bg-[#3d3f64] transition-colors border border-[#5a5d8e]"
              >
                {/* <Linkedin className="text-white" size={20} /> */}
              </a>
            </div>
            <p className="text-gray-400 text-sm">Perfiles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
