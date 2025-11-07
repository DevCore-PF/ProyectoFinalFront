"use client";
// import { useState, useEffect } from "react";

// const Loader = () => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen  flex items-center justify-center p-4">
//       <div className="text-center">
//         <div className="bg-slate-900/80 backdrop-blur-sm border border-border/60 rounded-lg shadow-2xl max-w-2xl mx-auto mb-8 overflow-hidden">
//           <div className="bg-slate-800/90 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
//             <div className="flex items-center gap-3">
//               <div className="flex gap-1.5">
//                 <div className="w-1 h-1 rounded-full bg-red-300"></div>
//                 <div className="w-1 h-1 rounded-full bg-yellow-300"></div>
//                 <div className="w-1 h-1 rounded-full bg-green-300"></div>
//               </div>
//               <span className="text-slate-300 text-sm font-medium">
//                 Terminal- devcore@devcore:~
//               </span>
//             </div>
//           </div>

//           <div className="p-6 text-left font-mono text-sm h-24 flex flex-col justify-between">
//             <div className="flex items-center gap-2">
//               <span className="text-accent-light">devcore@server</span>
//               <span className="text-slate-500">
//                 :<span className="text-button">~/</span>
//               </span>

//               <span className="text-slate-300">$</span>
//               <span className="text-slate-300">npm install DevCore</span>
//               <div className="w-0.5 h-4 bg-green-500 animate-pulse"></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
//                 <div
//                   className="h-full rounded-full transition-all duration-100"
//                   style={{
//                     width: `${progress}%`,
//                     background: `linear-gradient(to right, #3f4273, #a78bfa)`,
//                   }}
//                 ></div>
//               </div>
//               <span className="text-purple-300 text-xs w-10 text-right">
//                 {progress}%
//               </span>
//             </div>
//           </div>
//         </div>

//         <p className="text-accent-light text-lg font-light flex items-center justify-center gap-2">
//           <span className="text-accent-medium text-lg">&lt;/&gt;</span>
//           Cargando ...
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Loader;
import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="relative">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-button rounded-full animate-ping"></div>

          <div
            className="absolute inset-4 border-4 border-button/50 rounded-full"
            style={{ animation: "spin 2s linear infinite" }}
          ></div>

          <div className="absolute inset-8 bg-gradient-to-br from-purple-500 to-button/30 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <span className="text-white text-3xl font-bold">&lt;/&gt;</span>
          </div>

          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-medium rounded-full shadow-lg shadow-purple-400/50"></div>
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s", animationDelay: "1s" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-medium rounded-full shadow-lg shadow-pink-400/50"></div>
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s", animationDelay: "2s" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-medium rounded-full shadow-lg shadow-blue-400/50"></div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Loader;
