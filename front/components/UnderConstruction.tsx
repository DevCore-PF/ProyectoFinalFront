'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const UnderConstruction = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };
  return (
    <main className="relative min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px]">
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        
        
        <div className="max-w-2xl mx-auto text-center space-y-8">
          
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-title font-bold text-font-light">
              🚧
            </h1>
            <h2 className="text-4xl md:text-5xl font-title font-bold text-font-light mb-4">
              Página en
              <span className="bg-gradient-to-r from-button to-accent-medium bg-clip-text text-transparent ml-3">
                Construcción
              </span>
            </h2>
            <p className="text-lg md:text-xl text-font-light/80 font-body max-w-lg mx-auto">
              Estamos trabajando duro para traerte algo increíble. ¡Vuelve pronto!
            </p>
          </div>

          
          <div className="relative">
            <div className="bg-background2/30 border border-border rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-8xl md:text-9xl animate-bounce">
                🐱‍👤
              </div>
              <div className="mt-4 text-2xl">
                🔨⚒️🛠️
              </div>
            </div>
          </div>

          
          <div className="bg-background2/20 border border-border-light/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-font-light/90 font-body text-lg">
              <span className="text-accent-light font-semibold">DevCore</span> está codificando intensamente...
            </p>
            <p className="text-font-light/70 text-sm mt-2">
              (Con la ayuda de algunos gatitos programadores 🐾)
            </p>
          </div>

          
          <div className="space-y-3">
            <p className="text-font-light/80 text-sm font-body">Progreso estimado:</p>
            <div className="w-full bg-background2/40 rounded-full h-3 border border-border-light/20">
              <div className="bg-gradient-to-r from-button to-accent-medium h-full rounded-full relative overflow-hidden" style={{ width: '75%' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-accent-light text-sm font-body">75% completado</p>
          </div>

          
          <div className="pt-6">
            <button
              onClick={handleGoHome}
              data-button
              className="bg-button hover:bg-button/90 text-font-light px-8 py-3 rounded-lg font-semibold transition-all duration-300 border border-border-light/20 backdrop-blur-sm"
            >
              ← Ir al inicio
            </button>
          </div>

        </div>

        
        <div className="absolute top-20 left-10 text-2xl opacity-30 animate-pulse">
          💻
        </div>
        <div className="absolute top-40 right-20 text-2xl opacity-30 animate-pulse delay-1000">
          ☕
        </div>
        <div className="absolute bottom-20 left-20 text-2xl opacity-30 animate-pulse delay-500">
          🚀
        </div>
        <div className="absolute bottom-40 right-10 text-2xl opacity-30 animate-pulse delay-1500">
          ⚡
        </div>

      </div>
    </main>
  );
};

export default UnderConstruction;