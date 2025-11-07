"use client";

// import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-button rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-button rounded-full opacity-30"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-button rounded-full opacity-60"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-button rounded-full opacity-80"></div>
        </div>

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;
