"use client";

import React from 'react';
import { usePurchaseHistory } from '@/hooks/usePurchaseHistory';
import { PaymentFilter } from '@/types/purchase-history.types';
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
  FaArrowUp
} from 'react-icons/fa';

const PurchaseHistoryPage = () => {
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
      case 'succeeded':
        return <FaCheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
      case 'processing':
        return <FaClock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <FaTimesCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FaExclamationCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCardIcon = (brand: string) => {
    const iconClass = "h-6 w-6";
    switch (brand?.toLowerCase()) {
      case 'visa':
        return <div className={`${iconClass} bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold`}>V</div>;
      case 'mastercard':
        return <div className={`${iconClass} bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold`}>MC</div>;
      case 'amex':
        return <div className={`${iconClass} bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold`}>AE</div>;
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
            <span className="text-lg text-font-light">Cargando historial de transacciones...</span>
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
            <div className="flex items-center space-x-3 text-red-400">
              <FaExclamationCircle className="h-6 w-6" />
              <div>
                <h3 className="font-medium text-font-light">Error al cargar transacciones</h3>
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
    <main className="relative min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px]">
      <div className="max-w-7xl mx-auto px-6 py-8">{/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-font-light flex items-center space-x-3">
                <FaReceipt className="h-8 w-8 text-accent-medium" />
                <span>Historial de Transacciones</span>
              </h1>
              <p className="text-font-medium mt-2">Gestiona y revisa todas tus transacciones de pago</p>
            </div>
            <button
              onClick={refresh}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-800/80 border border-slate-600/50 text-slate-200 rounded-xl hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-200 shadow-lg cursor-pointer"
            >
              <FaSyncAlt className="h-4 w-4" />
              <span className="font-medium">Actualizar</span>
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 border-l-4 border-green-500 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Gasto Total</p>
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
                <p className="text-sm font-medium text-slate-400">Total Transacciones</p>
                <p className="text-2xl font-bold text-font-light">{stats.totalTransactions}</p>
              </div>
              <div className="p-3 bg-accent-medium/20 rounded-xl border border-accent-medium/30">
                <FaReceipt className="h-6 w-6 text-accent-light" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 border-l-4 border-purple-500 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Promedio por Transacción</p>
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
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
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
                onChange={(e) => handleFilterChange('cardBrand', e.target.value)}
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
                {hasActiveFilters ? 'No hay transacciones que coincidan con los filtros' : 'No hay transacciones disponibles'}
              </h3>
              <p className="text-font-medium">
                {hasActiveFilters 
                  ? 'Intenta ajustar los filtros para ver más resultados'
                  : 'Cuando realices compras, aparecerán aquí'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getCardIcon(transaction.cardBrand)}
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(transaction.status)}
                          <h4 className="font-medium text-font-light">
                            {formatCardBrand(transaction.cardBrand)} •••• {transaction.cardLast4}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'succeeded' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {formatPaymentStatus(transaction.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-font-medium">
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt className="h-4 w-4" />
                            <span>
                              {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short', 
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaReceipt className="h-4 w-4" />
                            <span>{transaction.courses.length} curso(s)</span>
                          </div>
                        </div>

                        {transaction.courses.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-font-medium mb-1">CURSOS ADQUIRIDOS:</p>
                            <div className="flex flex-wrap gap-2">
                              {transaction.courses.map((course) => (
                                <span
                                  key={course.id}
                                  className="inline-block px-3 py-1.5 bg-slate-700/70 border border-slate-600/50 text-slate-200 text-xs rounded-lg font-medium shadow-sm"
                                >
                                  {course.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-font-light">
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-font-medium uppercase">
                        {transaction.currency}
                      </p>
                    </div>
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