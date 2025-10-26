"use client";

import { useState } from "react";
// import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const ContactPage = () => {
  //   const [formData, setFormData] = useState({
  //     nombre: "",
  //     apellido: "",
  //     email: "",
  //     telefono: "",
  //     motivo: "",
  //     mensaje: "",
  //   });

  //   const [errors, setErrors] = useState({});
  //   const [touched, setTouched] = useState({});

  //   const validateField = (name, value) => {
  //     let error = "";

  //     switch (name) {
  //       case "nombre":
  //         if (!value) error = "El nombre es requerido";
  //         else if (value.length < 2) error = "Mínimo 2 caracteres";
  //         break;
  //       case "apellido":
  //         if (!value) error = "El apellido es requerido";
  //         else if (value.length < 2) error = "Mínimo 2 caracteres";
  //         break;
  //       case "email":
  //         if (!value) error = "El email es requerido";
  //         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  //           error = "Email inválido";
  //         break;
  //       case "telefono":
  //         if (value && !/^[0-9+\s\-()]*$/.test(value))
  //           error = "Formato de teléfono inválido";
  //         break;
  //       case "motivo":
  //         if (!value) error = "El motivo es requerido";
  //         else if (value.length < 5) error = "Mínimo 5 caracteres";
  //         break;
  //       case "mensaje":
  //         if (!value) error = "El mensaje es requerido";
  //         else if (value.length < 10) error = "Mínimo 10 caracteres";
  //         else if (value.length > 500) error = "Máximo 500 caracteres";
  //         break;
  //     }

  //     return error;
  //   };

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({ ...prev, [name]: value }));

  //     // if (touched[name]) {
  //     //   const error = validateField(name, value);
  //     //   setErrors((prev) => ({ ...prev, [name]: error }));
  //     // }
  //   };

  //   const handleBlur = (e) => {
  //     const { name, value } = e.target;
  //     setTouched((prev) => ({ ...prev, [name]: true }));
  //     const error = validateField(name, value);
  //     setErrors((prev) => ({ ...prev, [name]: error }));
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     // Marcar todos como touched
  //     const allTouched = Object.keys(formData).reduce((acc, key) => {
  //       acc[key] = true;
  //       return acc;
  //     }, {});
  //     setTouched(allTouched);

  //     // Validar todos los campos
  //     const newErrors = {};
  //     Object.keys(formData).forEach((key) => {
  //       const error = validateField(key, formData[key]);
  //       if (error) newErrors[key] = error;
  //     });

  //     setErrors(newErrors);

  //     // Si no hay errores, enviar
  //     if (Object.keys(newErrors).length === 0) {
  //       console.log("Contact values:", formData);
  //       alert("¡Mensaje enviado exitosamente!");
  //       setFormData({
  //         nombre: "",
  //         apellido: "",
  //         email: "",
  //         telefono: "",
  //         motivo: "",
  //         mensaje: "",
  //       });
  //       setTouched({});
  //       setErrors({});
  //     }
  //   };

  return (
    <div className="min-h-screen bg-[#1a1d3a] text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">Contactanos</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-[#252849] rounded-2xl p-8 shadow-xl">
          <div>
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingresá tu nombre"
                  //   value={formData.nombre}
                  //   onChange={handleChange}
                  //   onBlur={handleBlur}
                  className="w-full h-12 rounded-lg bg-[#3d4171] px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                {/* {touched.nombre && errors.nombre && (
                  <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
                )} */}
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  placeholder="Ingresá tu apellido"
                  //   value={formData.apellido}
                  //   onChange={handleChange}
                  //   onBlur={handleBlur}
                  className="w-full h-12 rounded-lg bg-[#3d4171] px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 "
                />
                {/* {touched.apellido && errors.apellido && (
                  <p className="text-red-400 text-xs mt-1">{errors.apellido}</p>
                )} */}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ingresá tu Email"
                  //   value={formData.email}
                  //   onChange={handleChange}
                  //   onBlur={handleBlur}
                  className="w-full h-12 rounded-lg bg-[#3d4171] px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 "
                />
                {/* {touched.email && errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )} */}
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="Ingresá tu teléfono"
                  //   value={formData.telefono}
                  //   onChange={handleChange}
                  //   onBlur={handleBlur}
                  className="w-full h-12 rounded-lg bg-[#3d4171] px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 "
                />
                {/* {touched.telefono && errors.telefono && (
                  <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>
                )} */}
              </div>
            </div>

            {/* Motivo */}
            <div className="mb-4">
              <label
                htmlFor="motivo"
                className="block text-sm mb-2 text-gray-300"
              >
                Motivo
              </label>
              <input
                type="text"
                id="motivo"
                name="motivo"
                placeholder="Ingresá el motivo de tu consulta"
                // value={formData.motivo}
                // onChange={handleChange}
                // onBlur={handleBlur}
                className="w-full h-12 rounded-lg bg-[#3d4171] px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 "
              />
              {/* {touched.motivo && errors.motivo && (
                <p className="text-red-400 text-xs mt-1">{errors.motivo}</p>
              )} */}
            </div>

            {/* Mensaje */}
            <div className="mb-6">
              <label
                htmlFor="mensaje"
                className="block text-sm mb-2 text-gray-300"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Enter your Message here..."
                maxLength={500}
                // value={formData.mensaje}
                // onChange={handleChange}
                // onBlur={handleBlur}
                className="w-full h-32 rounded-lg bg-[#3d4171] p-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none "
              />
              <div className="flex justify-between items-center mt-1">
                {/* {touched.mensaje && errors.mensaje ? (
                  <p className="text-red-400 text-xs">{errors.mensaje}</p>
                ) : (
                  <div></div>
                )} */}
                {/* <p
                  className={`text-xs ${
                    formData.mensaje.length > 500
                      ? "text-red-400"
                      : formData.mensaje.length >= 450
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {formData.mensaje.length}/500
                </p> */}
              </div>
            </div>

            {/* Botón */}
            <button
              type="button"
            //   onClick={handleSubmit}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Envía tu mensaje
            </button>
          </div>
        </div>

        {/* Info de contacto */}
        <div className="bg-[#4a4d7e] rounded-2xl p-8 shadow-xl flex flex-col justify-between">
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
