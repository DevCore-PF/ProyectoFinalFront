"use client";

import React from "react";
import { usePurchaseHistory } from "@/hooks/usePurchaseHistory";
import { PaymentFilter } from "@/types/purchase-history.types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import {
  FaCreditCard,
  FaCalendarAlt,
  FaDollarSign,
  FaReceipt,
  FaFilter,
  FaSyncAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowUp,
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

const PurchaseHistoryPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    transactions,
    stats,
    isLoading,
    error,
    filters,
    applyFilters,
    clearFilters,
    refresh,
    hasActiveFilters,
    formatCardBrand,
    formatPaymentStatus,
  } = usePurchaseHistory();

  const handleFilterChange = (key: keyof PaymentFilter, value: string) => {
    applyFilters({ [key]: value });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return <FaCheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
      case "processing":
        return <FaClock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <FaTimesCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <FaExclamationCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCardIcon = (brand: string) => {
    const iconClass = "h-6 w-6";
    switch (brand?.toLowerCase()) {
      case "visa":
        return (
          <div
            className={`${iconClass} bg-blue-600 rounded text-font-light flex items-center justify-center text-xs font-bold`}
          >
            V
          </div>
        );
      case "mastercard":
        return (
          <div
            className={`${iconClass} bg-amber-600 rounded text-font-light flex items-center justify-center text-xs font-bold`}
          >
            MC
          </div>
        );
      case "amex":
        return (
          <div
            className={`${iconClass} bg-green-600 rounded text-font-light flex items-center justify-center text-xs font-bold`}
          >
            AE
          </div>
        );
      default:
        return <FaCreditCard className={`${iconClass} text-gray-500`} />;
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px] flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <FaSyncAlt className="h-6 w-6 animate-spin text-accent-medium" />
            <span className="text-lg text-font-light">
              Cargando historial de transacciones...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center space-x-3 text-amber-400">
              <FaExclamationCircle className="h-6 w-6" />
              <div>
                <h3 className="font-medium text-font-light">
                  Error al cargar transacciones
                </h3>
                <p className="text-sm text-font-medium mt-1">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-3 px-6 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-200 shadow-lg font-medium"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(user?.role === 'teacher' ? '/teacher-dashboard' : '/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-font-light flex items-center gap-2 sm:gap-3">
                <FaReceipt className="h-6 w-6 sm:h-8 sm:w-8 text-accent-medium flex-shrink-0" />
                <span>Historial de Transacciones</span>
              </h1>
              <p className="text-font-medium mt-2 text-sm sm:text-base">
                Gestiona y revisa todas tus transacciones de pago
              </p>
            </div>
            <button
              onClick={refresh}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-200 shadow-lg cursor-pointer flex-shrink-0"
            >
              <FaSyncAlt className="h-4 w-4" />
              <span className="font-medium text-sm sm:text-base">Actualizar</span>
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 border-l-4 border-green-500 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Gasto Total
                </p>
                <p className="text-2xl font-bold text-font-light">
                  ${stats.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                <FaDollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 border-l-4 border-accent-medium shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Transacciones
                </p>
                <p className="text-2xl font-bold text-font-light">
                  {stats.totalTransactions}
                </p>
              </div>
              <div className="p-3 bg-accent-medium/20 rounded-xl border border-accent-medium/30">
                <FaReceipt className="h-6 w-6 text-accent-light" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 border-l-4 border-purple-500 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Promedio por Transacción
                </p>
                <p className="text-2xl font-bold text-font-light">
                  ${stats.averageTransaction.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <FaArrowUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <FaFilter className="h-5 w-5 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-font-light">Filtros</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-accent-medium hover:text-accent-light transition-colors ml-auto"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Estado de transacción
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-accent-medium focus:border-accent-medium text-font-light transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="succeeded">Exitosas</option>
                <option value="pending">Pendientes</option>
                <option value="failed">Fallidas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Periodo de tiempo
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-accent-medium focus:border-accent-medium text-font-light transition-all"
              >
                <option value="all">Todo el tiempo</option>
                <option value="30days">Últimos 30 días</option>
                <option value="3months">Últimos 3 meses</option>
                <option value="6months">Últimos 6 meses</option>
                <option value="1year">Último año</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Marca de tarjeta
              </label>
              <select
                value={filters.cardBrand}
                onChange={(e) =>
                  handleFilterChange("cardBrand", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-accent-medium focus:border-accent-medium text-font-light transition-all"
              >
                <option value="all">Todas las marcas</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Transacciones */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h3 className="text-lg font-medium text-font-light">
              Transacciones ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <FaReceipt className="h-12 w-12 text-font-medium mx-auto mb-4" />
              <h3 className="text-lg font-medium text-font-medium mb-2">
                {hasActiveFilters
                  ? "No hay transacciones que coincidan con los filtros"
                  : "No hay transacciones disponibles"}
              </h3>
              <p className="text-font-medium">
                {hasActiveFilters
                  ? "Intenta ajustar los filtros para ver más resultados"
                  : "Cuando realices compras, aparecerán aquí"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 sm:p-6 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header - Card info y Estado */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getCardIcon(transaction.cardBrand)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(transaction.status)}
                              <h4 className="font-medium text-font-light text-sm sm:text-base truncate">
                                {formatCardBrand(transaction.cardBrand)} ••••{" "}
                                {transaction.cardLast4}
                              </h4>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap self-start ${
                                transaction.status === "succeeded"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {formatPaymentStatus(transaction.status)}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-font-medium">
                            <div className="flex items-center gap-1.5">
                              <FaCalendarAlt className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(
                                  transaction.createdAt
                                ).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FaReceipt className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span>{transaction.courses.length} curso(s)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Monto - Movido aquí para mejor responsive */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl sm:text-2xl font-bold text-font-light">
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-font-medium uppercase">
                          {transaction.currency}
                        </p>
                      </div>
                    </div>

                    {/* Cursos adquiridos */}
                    {transaction.courses.length > 0 && (
                      <div className="pt-2 border-t border-slate-700/30">
                        <p className="text-xs font-medium text-font-medium mb-2">
                          CURSOS ADQUIRIDOS:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {transaction.courses.map((course) => (
                            <span
                              key={course.id}
                              className="inline-block px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-700/70 border border-slate-600/50 text-slate-200 text-xs rounded-lg font-medium shadow-sm break-words"
                            >
                              {course.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PurchaseHistoryPage;
// "use client";

// import React from 'react';
// import { usePurchaseHistory } from '@/hooks/usePurchaseHistory';
// import { PaymentFilter } from '@/types/purchase-history.types';
// import {
//   HiCreditCard,
//   HiCalendar,
//   HiCurrencyDollar,
//   HiReceiptTax,
//   HiFilter,
//   HiRefresh,
//   HiExclamationCircle,
//   HiCheckCircle,
//   HiClock,
//   HiXCircle,
//   HiTrendingUp,
//   HiChartBar,
// } from 'react-icons/hi';
// import Loader from '@/components/Loaders/Loader';

// const PurchaseHistoryPage = () => {
//   const {
//     transactions,
//     stats,
//     isLoading,
//     error,
//     filters,
//     applyFilters,
//     clearFilters,
//     refresh,
//     hasActiveFilters,
//     formatCardBrand,
//     formatPaymentStatus,
//   } = usePurchaseHistory();

//   const handleFilterChange = (key: keyof PaymentFilter, value: string) => {
//     applyFilters({ [key]: value });
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'succeeded':
//         return <HiCheckCircle className="w-5 h-5 text-emerald-400" />;
//       case 'pending':
//       case 'processing':
//         return <HiClock className="w-5 h-5 text-yellow-400" />;
//       case 'failed':
//         return <HiXCircle className="w-5 h-5 text-amber-400" />;
//       default:
//         return <HiExclamationCircle className="w-5 h-5 text-slate-400" />;
//     }
//   };

//   const getCardIcon = (brand: string) => {
//     const iconClass = "w-6 h-6";
//     switch (brand?.toLowerCase()) {
//       case 'visa':
//         return <div className={`${iconClass} bg-blue-600 rounded text-font-light flex items-center justify-center text-xs font-bold`}>V</div>;
//       case 'mastercard':
//         return <div className={`${iconClass} bg-amber-600 rounded text-font-light flex items-center justify-center text-xs font-bold`}>MC</div>;
//       case 'amex':
//         return <div className={`${iconClass} bg-emerald-600 rounded text-font-light flex items-center justify-center text-xs font-bold`}>AE</div>;
//       default:
//         return <HiCreditCard className={`${iconClass} text-slate-400`} />;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Loader size="medium" />
//           <p className="text-slate-400 mt-4">Cargando historial de transacciones...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="max-w-md mx-auto px-6">
//           <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-8 text-center">
//             <HiExclamationCircle className="w-16 h-16 mx-auto text-amber-400 mb-4" />
//             <h3 className="text-xl font-semibold text-font-light mb-2">Error al cargar transacciones</h3>
//             <p className="text-slate-400 mb-6">{error}</p>
//             <button
//               onClick={refresh}
//               className="px-6 py-3 bg-button/80 hover:bg-button text-font-light rounded-lg font-medium transition-all"
//             >
//               Intentar nuevamente
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background p-6 md:p-10">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-font-light mb-2">
//                 Historial de Transacciones
//               </h1>
//               <p className="text-slate-400">Gestiona y revisa todas tus transacciones de pago</p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={refresh}
//                 className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-font-light px-4 py-2 rounded-lg font-medium transition-all"
//               >
//                 <HiRefresh className="w-5 h-5" />
//                 Actualizar
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Estadísticas */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="p-2 bg-emerald-500/10 rounded-lg">
//                 <HiCurrencyDollar className="w-4 h-4 text-emerald-300" />
//               </div>
//               <p className="text-slate-400 text-xs">Gasto Total</p>
//             </div>
//             <p className="text-2xl font-bold text-font-light">
//               ${stats.totalSpent.toFixed(2)}
//             </p>
//           </div>

//           <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="p-2 bg-purple-500/10 rounded-lg">
//                 <HiReceiptTax className="w-4 h-4 text-purple-300" />
//               </div>
//               <p className="text-slate-400 text-xs">Total Transacciones</p>
//             </div>
//             <p className="text-2xl font-bold text-font-light">{stats.totalTransactions}</p>
//           </div>

//           <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="p-2 bg-blue-500/10 rounded-lg">
//                 <HiTrendingUp className="w-4 h-4 text-blue-300" />
//               </div>
//               <p className="text-slate-400 text-xs">Promedio por Transacción</p>
//             </div>
//             <p className="text-2xl font-bold text-font-light">
//               ${stats.averageTransaction.toFixed(2)}
//             </p>
//           </div>
//         </div>

//         {/* Filtros */}
//         <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 mb-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <HiFilter className="w-5 h-5 text-slate-400" />
//               <h3 className="text-lg font-semibold text-font-light">Filtros</h3>
//             </div>
//             {hasActiveFilters && (
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-accent-medium hover:text-accent-light transition-colors"
//               >
//                 Limpiar filtros
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Estado de transacción
//               </label>
//               <select
//                 value={filters.status}
//                 onChange={(e) => handleFilterChange('status', e.target.value)}
//                 className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
//               >
//                 <option value="all">Todos los estados</option>
//                 <option value="succeeded">Exitosas</option>
//                 <option value="pending">Pendientes</option>
//                 <option value="failed">Fallidas</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Periodo de tiempo
//               </label>
//               <select
//                 value={filters.dateRange}
//                 onChange={(e) => handleFilterChange('dateRange', e.target.value)}
//                 className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
//               >
//                 <option value="all">Todo el tiempo</option>
//                 <option value="30days">Últimos 30 días</option>
//                 <option value="3months">Últimos 3 meses</option>
//                 <option value="6months">Últimos 6 meses</option>
//                 <option value="1year">Último año</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Marca de tarjeta
//               </label>
//               <select
//                 value={filters.cardBrand}
//                 onChange={(e) => handleFilterChange('cardBrand', e.target.value)}
//                 className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
//               >
//                 <option value="all">Todas las marcas</option>
//                 <option value="visa">Visa</option>
//                 <option value="mastercard">Mastercard</option>
//                 <option value="amex">American Express</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Lista de Transacciones */}
//         <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
//           <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
//             <h3 className="text-lg font-semibold text-font-light">
//               Transacciones ({transactions.length})
//             </h3>
//           </div>

//           {transactions.length === 0 ? (
//             <div className="p-12 text-center">
//               <HiReceiptTax className="w-16 h-16 text-slate-600 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-slate-400 mb-2">
//                 {hasActiveFilters ? 'No hay transacciones que coincidan con los filtros' : 'No hay transacciones disponibles'}
//               </h3>
//               <p className="text-slate-500 text-sm">
//                 {hasActiveFilters
//                   ? 'Intenta ajustar los filtros para ver más resultados'
//                   : 'Cuando realices compras, aparecerán aquí'
//                 }
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-slate-700/50">
//               {transactions.map((transaction) => (
//                 <div key={transaction.id} className="p-6 hover:bg-slate-800/30 transition-colors">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-4">
//                       <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600">
//                         {getCardIcon(transaction.cardBrand)}
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           {getStatusIcon(transaction.status)}
//                           <h4 className="font-medium text-font-light">
//                             {formatCardBrand(transaction.cardBrand)} •••• {transaction.cardLast4}
//                           </h4>
//                           <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${
//                             transaction.status === 'succeeded'
//                               ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
//                               : transaction.status === 'pending'
//                               ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
//                               : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
//                           }`}>
//                             {formatPaymentStatus(transaction.status)}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
//                           <div className="flex items-center gap-1">
//                             <HiCalendar className="w-4 h-4" />
//                             <span>
//                               {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: '2-digit',
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <HiReceiptTax className="w-4 h-4" />
//                             <span>{transaction.courses.length} curso(s)</span>
//                           </div>
//                         </div>

//                         {transaction.courses.length > 0 && (
//                           <div className="mt-3">
//                             <p className="text-xs font-medium text-slate-400 mb-2">CURSOS ADQUIRIDOS:</p>
//                             <div className="flex flex-wrap gap-2">
//                               {transaction.courses.map((course) => (
//                                 <span
//                                   key={course.id}
//                                   className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 text-slate-300 text-xs rounded-lg"
//                                 >
//                                   {course.title}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <p className="text-2xl font-bold text-emerald-300">
//                         ${transaction.amount.toFixed(2)}
//                       </p>
//                       <p className="text-sm text-slate-400 uppercase">
//                         {transaction.currency}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseHistoryPage;
