
///////////////////////////////PRIMERA OPCION

// "use client";

// import Link from "next/link";
// import { IoFlashSharp } from "react-icons/io5";
// import Image from "next/image";
// import { FaGraduationCap, FaInfinity } from "react-icons/fa";
// import { useState } from "react";
// import { FaExclamation } from "react-icons/fa6";
// import { toastSuccess } from "@/helpers/alerts.helper";
// import { useFormik } from "formik";
// import {
//   suscriptionFormType,
//   suscriptionInitialValues,
//   suscriptionValidation,
// } from "@/validators/suscriptionSchema";

// const HeroSection = () => {
//   const [isSubscribing, setIsSubscribing] = useState(false);
//   const [showErrors, setShowErrors] = useState(false);

//   const formik = useFormik<suscriptionFormType>({
//     initialValues: suscriptionInitialValues,
//     validationSchema: suscriptionValidation,
//     onSubmit: async (values) => {
//       setIsSubscribing(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Newsletter subscription:", values.email);
//       toastSuccess("¡Te has suscrito al newsletter exitosamente!");
//       setIsSubscribing(false);
//       setShowErrors(false);
//       formik.resetForm();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setShowErrors(true);
//     formik.handleSubmit();
//   };

//   return (
//     <div className="min-h-screen pt-6 pb-20 relative overflow-hidden">

//       <div className="relative z-10 max-w-380 mx-auto px-4 sm:px-8 lg:px-16">
//         <div className="flex justify-center mb-3 sm:mb-8 pt-8 lg:pt-12">
//           <div className="relative inline-flex ">
//             <Image
//               src="/icons/Lines.svg"
//               width={36}
//               height={25}
//               alt="Decorative lines"
//               className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 lg:-left-7 lg:-top-7 z-10 w-6 h-auto sm:w-8 lg:w-9 "
//             />
//             <div className="relative inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-slate-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 shadow-lg hover:border-slate-600/50 transition-all duration-300 hover:shadow-button/20">
//               <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-accent-medium rounded shrink-0 ">
//                 <IoFlashSharp className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
//               </div>
//               <span className="font-title text-font-light font-semibold text-lg md:text-3xl lg:text-6xl leading-tight whitespace-nowrap">
//                 <span className="text-button/90">Potencia</span> tu creatividad
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-7 sm:mb-10">
//           <h1 className="text-white  leading-[150%] text-center tracking-normal font-medium text-2xl sm:text-3xl lg:text-5xl  px-4">
//             Con formación online en diseño y desarrollo
//           </h1>

//           <p className="text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto text-center font-normal font-body text-base sm:text-lg lg:text-xl px-4 ">
//             Aprende con expertos de la industria y lleva tus habilidades al
//             siguiente nivel
//           </p>

//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 w-full sm:w-auto px-4 max-w-md sm:max-w-none mx-auto ">
//             <Link
//               href="#courses"
//               className="px-6 sm:px-8 py-3 bg-button/90 hover:bg-button text-font-light font-semibold rounded-lg transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95"
//             >
//               Explorar cursos
//             </Link>
//             <Link
//               href="#pricing"
//               className="px-6 sm:px-8 py-3 bg-font-light text-font-dark/80 text-sm md:text-base hover:bg-gray-100 hover:text-button font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg"
//             >
//               Ver Planes
//             </Link>
//           </div>
//         </div>

//         {/* Cards Section - Full Width */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12  ">
//           {/* Memberships Card */}
//           <div className="lg:col-span-1 relative group">
//             <div className="absolute inset-0 bg-button/20 rounded-2xl blur-xl group-hover:bg-button/30 transition-all duration-500"></div>
//             <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-button/50 transition-all duration-300 h-full">
//               <div className="flex flex-col h-full">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="p-3 bg-button/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
//                     <FaInfinity className="text-accent-light text-3xl" />
//                   </div>
//                   <h3 className="text-white font-semibold text-2xl">
//                     Membresías
//                   </h3>
//                 </div>
//                 <p className="text-slate-300 text-sm mb-4 grow">
//                   Acceso ilimitado a todos los cursos. Aprende sin límites y
//                   mantente actualizado con contenido nuevo cada semana.
//                 </p>
//                 <div className="flex gap-2 flex-wrap">
//                   <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
//                     1 mes
//                   </span>
//                   <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
//                     3 meses
//                   </span>
//                   <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
//                     Anual
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Individual Courses Card */}
//           <div className="lg:col-span-1 relative group">
//             <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
//             <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 h-full">
//               <div className="flex flex-col h-full">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
//                     <FaGraduationCap className="text-accent-light text-3xl" />
//                   </div>
//                   <h3 className="text-white font-semibold text-2xl">
//                     Cursos Individuales
//                   </h3>
//                 </div>
//                 <p className="text-slate-300 text-sm mb-4 grow">
//                   Elige y paga solo por lo que necesitas. Acceso permanente y
//                   actualizaciones gratuitas de por vida.
//                 </p>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-400">Desde $19</span>
//                     <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300 text-xs">
//                       Acceso permanente
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Newsletter Subscription Card */}
//           <div className="lg:col-span-1 relative group">
//             <div className="absolute inset-0 bg-linear-to-br from-button/10 to-purple-500/10 rounded-2xl blur-xl group-hover:from-button/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
//             <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-slate-600/70 transition-all duration-300 h-full">
//               <div className="flex flex-col h-full">
//                 <h3 className="text-white font-semibold text-xl mb-2">
//                   Ofertas exclusivas
//                 </h3>
//                 <p className="text-slate-300 text-sm mb-4">
//                   Suscríbete para recibir descuentos y contenido exclusivo
//                 </p>

//                 <form onSubmit={handleSubmit} className="space-y-3 mt-auto">
//                   <div className="space-y-2">
//                     <input
//                       type="email"
//                       placeholder="tu@email.com"
//                       {...formik.getFieldProps("email")}
//                       className={`w-full h-11 rounded-lg  bg-slate-900/60 backdrop-blur-sm border px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none transition-all ${
//                         showErrors && formik.errors.email
//                           ? "border-amber-400/50 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50"
//                           : "border-slate-700/50 focus:border-button/50 focus:ring-1 focus:ring-button/50"
//                       }`}
//                     />

//                     {showErrors && formik.errors.email && (
//                       <div className="px-3 py-2 bg-amber-500/10 border flex items-center justify-center border-amber-500/30 rounded-lg">
//                         <p className="text-amber-300 text-xs flex items-center ">
//                           <FaExclamation className="shrink-0" size={14} />
//                           <span>{formik.errors.email}</span>
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isSubscribing}
//                     className="w-full text-sm py-2.5 bg-button hover:bg-[#6d3dc4] text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-button/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                   >
//                     {isSubscribing ? "Suscribiendo..." : "Suscribirme"}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Code Message */}
//         <div className="max-w-2xl mx-auto ">
//           <div className="bg-linear-to-r from-button/10 to-purple-500/10  border border-border-light/30 rounded-xl p-3 hover:border-button/40 transition-all duration-300">
//             <p className="text-yellow-200/90 font-mono font-semibold text-sm lg:text-base text-center">
//               <span className="font-title">&lt;</span> Tu próxima lección al
//               alcance de tu mano{" "}
//               <span className="font-title">
//                 /<span>&gt;</span>
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

   
//     </div>
//   );
// };

// export default HeroSection;
////////////////////////////////////////////////////////////////SEGUNDA OPCION
// import { FaGraduationCap, FaInfinity } from "react-icons/fa";
// import CreativityBadge from "./CreativityBadge";
// import EmailSubscription from "./EmailSubscription";
// const HeroSection = () => {
//   return (
//     <>
//       <div className="min-h-screen pt-6 pb-22 relative overflow-hidden">
//         <div className="relative z-10 min-h-screen flex flex-col">
//           <div className="mb-4 sm:mb-6">
//             <CreativityBadge />
//           </div>

//           <div className="flex justify-center items-center pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-8 lg:px-16">
//             <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20 max-w-7xl w-full">
//               <EmailSubscription />

//               {/* Visual alternativo con iconos y cards */}
//               <div className="hidden lg:block relative w-[400px] md:w-[450px] lg:w-[500px] shrink-0 order-1 lg:order-2">
//                 <div className="space-y-6">
//                   {/* Card de Membresías */}
//                   <div className="relative group">
//                     <div className="absolute inset-0 bg-button/20 rounded-2xl blur-xl group-hover:bg-button/30 transition-all duration-300"></div>
//                     <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-button/50 transition-all duration-300">
//                       <div className="flex items-start gap-4">
//                         <div className="p-3 bg-button/20 rounded-xl">
//                           <FaInfinity className="text-button text-3xl" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-white font-semibold text-xl mb-2">
//                             Membresías
//                           </h3>
//                           <p className="text-slate-300 text-sm mb-3">
//                             Acceso ilimitado a todos los cursos
//                           </p>
//                           <div className="flex gap-2 flex-wrap">
//                             <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium">
//                               1 mes
//                             </span>
//                             <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium">
//                               3 meses
//                             </span>
//                             <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium">
//                               Anual
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card de Cursos Individuales */}
//                   <div className="relative group">
//                     <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:bg-purple-500/30 transition-all duration-300"></div>
//                     <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
//                       <div className="flex items-start gap-4">
//                         <div className="p-3 bg-purple-500/20 rounded-xl">
//                           <FaGraduationCap className="text-purple-400 text-3xl" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-white font-semibold text-xl mb-2">
//                             Cursos Individuales
//                           </h3>
//                           <p className="text-slate-300 text-sm mb-3">
//                             Elige y paga solo por lo que necesitas
//                           </p>
//                           <div className="flex items-center gap-2">
//                             <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
//                               <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-3/4 rounded-full"></div>
//                             </div>
//                             <span className="text-purple-400 text-xs font-medium">
//                               Acceso permanente
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mensaje decorativo */}
//                   <div className="relative">
//                     <div className="bg-gradient-to-r from-button/10 to-purple-500/10 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4">
//                       <p className="text-yellow-200 font-mono font-semibold text-sm lg:text-base text-center">
//                         <span className="font-title">&lt;</span> Tu próxima
//                         lección al alcance de tu mano{" "}
//                         <span className="font-title">
//                           /<span>&gt;</span>
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HeroSection;


// "use client";

// import Link from "next/link";
// import { IoFlashSharp } from "react-icons/io5";
// import Image from "next/image";
// import { FaGraduationCap, FaInfinity, FaCode, FaRocket, FaCertificate } from "react-icons/fa";
// import { useState } from "react";
// import { FaExclamation } from "react-icons/fa6";
// import { toastSuccess } from "@/helpers/alerts.helper";
// import { useFormik } from "formik";
// import {
//   suscriptionFormType,
//   suscriptionInitialValues,
//   suscriptionValidation,
// } from "@/validators/suscriptionSchema";

// const HeroSection = () => {
//   const [isSubscribing, setIsSubscribing] = useState(false);
//   const [showErrors, setShowErrors] = useState(false);

//   const formik = useFormik<suscriptionFormType>({
//     initialValues: suscriptionInitialValues,
//     validationSchema: suscriptionValidation,
//     onSubmit: async (values) => {
//       setIsSubscribing(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Newsletter subscription:", values.email);
//       toastSuccess("¡Te has suscrito al newsletter exitosamente!");
//       setIsSubscribing(false);
//       setShowErrors(false);
//       formik.resetForm();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setShowErrors(true);
//     formik.handleSubmit();
//   };

//   return (
//     <div className="min-h-screen pt-10 pb-20 relative overflow-hidden">
      
//       {/* Grid decorativo de fondo */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `radial-gradient(circle at 2px 2px, rgba(126, 75, 222, 0.15) 1px, transparent 0)`,
//           backgroundSize: '40px 40px'
//         }}></div>
//       </div>

//       <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
//         {/* Badge Section */}
//         <div className="flex justify-center mb-3 sm:mb-8 pt-8 lg:pt-12">
//           <div className="relative inline-flex">
//             <Image
//               src="/icons/Lines.svg"
//               width={36}
//               height={25}
//               alt="Decorative lines"
//               className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 lg:-left-7 lg:-top-7 z-10 w-6 h-auto sm:w-8 lg:w-9"
//             />
//             <div className="relative inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-slate-900/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 shadow-lg hover:border-slate-600/50 transition-all duration-300 hover:shadow-button/20">
//               <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-accent-medium rounded shrink-0">
//                 <IoFlashSharp className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
//               </div>
//               <span className="font-title text-font-light font-semibold text-lg md:text-3xl lg:text-6xl leading-tight whitespace-nowrap">
//                 <span className="text-button/90">Potencia</span> tu creatividad
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Main Headline */}
//         <div className="text-center mb-7 sm:mb-20">
//           <h1 className="text-white leading-[150%] text-center tracking-normal font-medium text-2xl sm:text-3xl lg:text-5xl px-4 mb-4">
//             Con formación online en diseño y desarrollo
//           </h1>

//           <p className="text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto text-center font-normal font-body text-base sm:text-lg lg:text-xl px-4">
//             Aprende con expertos de la industria y lleva tus habilidades al siguiente nivel
//           </p>

//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 w-full sm:w-auto px-4 max-w-md sm:max-w-none mx-auto">
//             <Link
//               href="#courses"
//               className="px-6 sm:px-8 py-3 bg-button/90 hover:bg-button text-font-light font-semibold rounded-lg transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-purple-500/25 cursor-pointer hover:scale-105 active:scale-95"
//             >
//               Explorar cursos
//             </Link>
//             <Link
//               href="#pricing"
//               className="px-6 sm:px-8 py-3 bg-font-light text-font-dark/80 text-sm md:text-base hover:bg-gray-100 hover:text-button font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg"
//             >
//               Ver Planes
//             </Link>
//           </div>
//         </div>

//         {/* Main Content Grid - 2 Columns */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Left Column - Memberships & Courses Cards */}
//           <div className="space-y-6">
//             {/* Memberships Card */}
//             <div className="relative group">
//               <div className="absolute inset-0 bg-button/20 rounded-2xl blur-xl group-hover:bg-button/30 transition-all duration-500"></div>
//               <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-button/50 transition-all duration-300">
//                 <div className="flex flex-col">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 bg-button/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
//                       <FaInfinity className="text-accent-light text-3xl" />
//                     </div>
//                     <h3 className="text-white font-semibold text-2xl">Membresías</h3>
//                   </div>
//                   <p className="text-slate-300 text-sm mb-4">
//                     Acceso ilimitado a todos los cursos. Aprende sin límites y mantente actualizado con contenido nuevo cada semana.
//                   </p>
//                   <div className="flex gap-2 flex-wrap">
//                     <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
//                       1 mes
//                     </span>
//                     <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
//                       3 meses
//                     </span>
//                     <span className="px-3 py-1 bg-button/10 border border-button/30 rounded-full text-[#a78bfa] text-xs font-medium hover:bg-button/20 transition-colors duration-200">
//                       Anual
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Individual Courses Card */}
//             <div className="relative group">
//               <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
//               <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
//                 <div className="flex flex-col">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
//                       <FaGraduationCap className="text-accent-light text-3xl" />
//                     </div>
//                     <h3 className="text-white font-semibold text-2xl">Cursos Individuales</h3>
//                   </div>
//                   <p className="text-slate-300 text-sm mb-4">
//                     Elige y paga solo por lo que necesitas. Acceso permanente y actualizaciones gratuitas de por vida.
//                   </p>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-slate-400">Desde $19</span>
//                       <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300 text-xs">
//                         Acceso permanente
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="max-w-2xl mx-auto">
//           <div className="bg-gradient-to-r from-button/10 to-purple-500/10 border border-border-light/30 rounded-xl p-3 hover:border-button/40 transition-all duration-300">
//             <p className="text-yellow-200/90 font-mono font-semibold text-sm lg:text-base text-center">
//               <span className="font-title">&lt;</span> Tu próxima lección al alcance de tu mano{" "}
//               <span className="font-title">/<span>&gt;</span></span>
//             </p>
//           </div>
//         </div>
//           </div>

//           {/* Right Column - Main Hero Visual */}
//           <div className="relative">
//             <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
//               {/* Main Visual Card */}
//               <div className="absolute inset-0 bg-linear-to-br from-button/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
//               <div className="relative h-full bg-slate-800/40 backdrop-blur-sm border-2 border-button/30 rounded-3xl p-8 overflow-hidden">
//                 {/* Decorative circles */}
//                 <div className="absolute top-10 right-10 w-32 h-32 bg-button/10 rounded-full blur-xl"></div>
//                 <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
                
//                 {/* Content */}
//                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
//                   <div className="mb-8">
//                     <div className="inline-flex p-6 bg-button/10 backdrop-blur-sm rounded-2xl border border-button/30 mb-6">
//                       <FaCode className="text-accent-light text-7xl" />
//                     </div>
//                     <h2 className="text-white text-3xl lg:text-4xl font-bold mb-4">
//                       Transforma tu futuro
//                     </h2>
//                     <p className="text-slate-300 text-lg max-w-md mx-auto">
//                       Únete a miles de estudiantes que ya están construyendo sus carreras tech
//                     </p>
//                   </div>

//                   {/* Stats */}
//                   <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
//                     <div className="text-center">
//                       <div className="text-button text-3xl font-bold mb-1">50+</div>
//                       <div className="text-slate-400 text-sm">Cursos</div>
//                     </div>
//                     <div className="text-center border-x border-slate-700/50">
//                       <div className="text-button text-3xl font-bold mb-1">10k+</div>
//                       <div className="text-slate-400 text-sm">Estudiantes</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-button text-3xl font-bold mb-1">95%</div>
//                       <div className="text-slate-400 text-sm">Satisfacción</div>
//                     </div>
//                   </div>

//                   {/* Features badges */}
//                   <div className="flex flex-wrap justify-center gap-3 mt-8">
//                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
//                       <FaRocket className="text-accent-medium" />
//                       <span className="text-slate-200 text-sm">Proyectos reales</span>
//                     </div>
//                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
//                       <FaCertificate className="text-accent-medium" />
//                       <span className="text-slate-200 text-sm">Certificados</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Newsletter Subscription - Centered */}
//         <div className="max-w-7xl mx-auto mb-6">
//           <div className="relative group">
//             <div className="absolute inset-0 bg-linear-to-br from-button/10 to-purple-500/10 rounded-2xl blur-xl group-hover:from-button/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
//             <div className="relative bg-slate-800/60 backdrop-blur-sm border border-border-light/50 rounded-2xl p-6 hover:border-slate-600/70 transition-all duration-300">
//               <div className="flex flex-col">
//                 <h3 className="text-white font-semibold text-xl mb-2 text-center">Ofertas exclusivas</h3>
//                 <p className="text-slate-300 text-sm mb-4 text-center">
//                   Suscríbete para recibir descuentos y contenido exclusivo
//                 </p>

//                 <form onSubmit={handleSubmit} className="space-y-3 flex gap-2 items-center justify-center">
                  
//                     <input
//                       type="email"
//                       placeholder="Ingresa tu email"
//                       {...formik.getFieldProps("email")}
//                       className={`w-1/2 h-11 mb-0 rounded-lg bg-slate-900/60 backdrop-blur-sm border px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none transition-all ${
//                         showErrors && formik.errors.email
//                           ? "border-amber-400/50 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50"
//                           : "border-slate-700/50 focus:border-button/50 focus:ring-1 focus:ring-button/50"
//                       }`}
//                     />

                 

//                   <button
//                     type="submit"
//                     disabled={isSubscribing}
//                     className="w-1/4 h-10 text-sm  bg-button hover:bg-[#6d3dc4] text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer hover:scale-102 active:scale-95 hover:shadow-lg hover:shadow-button/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                   >
//                     {isSubscribing ? "Suscribiendo..." : "Suscribirme"}
//                   </button>
                  
//                 </form>
//                    {showErrors && formik.errors.email && (
//                       <div className="px-3 py-2 w-1/3 mx-auto mt-2 bg-amber-500/10 border flex items-center justify-center border-amber-500/30 rounded-lg">
//                         <p className="text-amber-300 text-xs flex items-center gap-2">
//                           <FaExclamation className="shrink-0" size={14} />
//                           <span>{formik.errors.email}</span>
//                         </p>
//                       </div>
//                     )}
//               </div>
//             </div>
//           </div>
//         </div>

      
//       </div>
//     </div>
//   );
// };

// export default HeroSection;


"use client";

import CreativityBadge from "./CreativityBadge";
import EmailSubscription from "./EmailSubscription";
import HeroCards from "./HeroCards";

const HeroSection = () => {
  return (
    <div className="min-h-screen pt-10 pb-20 relative overflow-hidden">

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        <CreativityBadge />
        <HeroCards />
        <EmailSubscription />
      </div>
    </div>
  );
};

export default HeroSection;