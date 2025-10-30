'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  const [message, setMessage] = useState('Verificando tu pago...');

  useEffect(() => {
    // El webhook ya procesó todo en el backend
    // Solo mostramos confirmación al usuario
    const timer = setTimeout(() => {
      setMessage('¡Pago completado exitosamente!');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Ícono de éxito */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-12 h-12 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          ¡Pago exitoso!
        </h1>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            ✨ Tus cursos ya están disponibles en tu cuenta
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            // onClick={() => router.push('/my-courses')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
          >
            Ver mis cursos
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}