"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { earningsService, Earning, EarningsStats } from '@/services/earnings.service';
import { HiCash, HiClock, HiCheckCircle, HiShoppingCart, HiArrowLeft, HiFilter } from 'react-icons/hi';
import TinyLoader from '@/components/Loaders/TinyLoader';
import Loader from '@/components/Loaders/Loader';
import { toastError } from '@/helpers/alerts.helper';

const EarningsPage = () => {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [filteredEarnings, setFilteredEarnings] = useState<Earning[]>([]);
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "teacher") {
        router.push("/");
      } else if (token) {
        fetchEarnings();
      }
    }
  }, [authLoading, user, token, router]);

  useEffect(() => {
    // Aplicar filtro local
    if (filterStatus === 'ALL') {
      setFilteredEarnings(earnings);
    } else {
      const statusMap = {
        'PENDING': ['Pendiente', 'En Proceso'],
        'PAID': ['Pagado']
      };
      setFilteredEarnings(
        earnings.filter(e => statusMap[filterStatus].includes(e.status))
      );
    }
  }, [filterStatus, earnings]);

  const fetchEarnings = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await earningsService.getMyEarnings(token, 'ALL');
      setEarnings(data);
      setFilteredEarnings(data);
      const calculatedStats = earningsService.calculateStats(data);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error:', error);
      toastError('Error al cargar los ingresos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagado':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'En Proceso':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Pendiente':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/teacher-dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <HiCash className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Mis Ingresos
              </h1>
              <p className="text-slate-400">
                Historial completo de ganancias por ventas de cursos
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <HiCash className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Total Ganado</p>
              </div>
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(stats.totalEarnings)}
              </p>
              <p className="text-xs text-green-300/60 mt-2">Histórico completo</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <HiClock className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Pendiente</p>
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {formatCurrency(stats.pendingEarnings)}
              </p>
              <p className="text-xs text-blue-300/60 mt-2">Por cobrar</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <HiCheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Pagado</p>
              </div>
              <p className="text-3xl font-bold text-emerald-400">
                {formatCurrency(stats.paidEarnings)}
              </p>
              <p className="text-xs text-emerald-300/60 mt-2">Recibido</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <HiShoppingCart className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Total Ventas</p>
              </div>
              <p className="text-3xl font-bold text-purple-400">
                {stats.totalSales}
              </p>
              <p className="text-xs text-purple-300/60 mt-2">Cursos vendidos</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <HiFilter className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400 font-medium">Filtrar por estado:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'PENDING', 'PAID'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-button text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {status === 'ALL' ? 'Todos' : status === 'PENDING' ? 'Pendientes' : 'Pagados'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de ingresos */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          {filteredEarnings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCash className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-slate-300 text-lg font-semibold mb-2">
                No hay ingresos registrados
              </p>
              <p className="text-slate-500 text-sm">
                {filterStatus !== 'ALL' 
                  ? 'Prueba cambiando el filtro para ver otros ingresos' 
                  : 'Los ingresos aparecerán aquí cuando los estudiantes compren tus cursos'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Historial de Transacciones
                </h2>
                <span className="text-sm text-slate-400">
                  {filteredEarnings.length} {filteredEarnings.length === 1 ? 'resultado' : 'resultados'}
                </span>
              </div>
              
              <div className="space-y-3">
                {filteredEarnings.map((earning) => (
                  <div
                    key={earning.saleId}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 sm:p-5 hover:border-slate-600 hover:bg-slate-900/70 transition-all"
                  >
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Header - Título y Estado */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-font-light font-semibold text-base sm:text-lg flex-1 min-w-0 break-words">
                          {earning.courseTitle}
                        </h3>
                        <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(earning.status)}`}>
                          {earning.status}
                        </div>
                      </div>

                      {/* Info - Fecha y Referencia */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          📅 {formatDate(earning.saleDate)}
                        </span>
                        {earning.paymentReference && (
                          <>
                            <span className="hidden sm:inline text-slate-600">•</span>
                            <span className="flex items-center gap-1.5 truncate">
                              🔖 Ref: {earning.paymentReference}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Footer - Ganancia */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                        <div className="text-left">
                          <p className="text-xs text-slate-500 mb-0.5">Tu ganancia</p>
                          <p className="text-2xl sm:text-3xl font-bold text-green-400">
                            {formatCurrency(earning.yourEarnings)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
